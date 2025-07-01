#!/bin/bash

# 🚀 Script de Setup Automático para Azure Emergency App
# Ejecutar: curl -sSL https://raw.githubusercontent.com/emergency-app/setup/main/azure-setup.sh | bash

set -e

echo "🚀 Iniciando setup de Azure Emergency App..."

# Variables
RESOURCE_GROUP="emergency-rg"
LOCATION="West Europe"
APP_NAME="emergency-app"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar Azure CLI
if ! command -v az &> /dev/null; then
    print_error "Azure CLI no está instalado. Instálalo desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Login a Azure
print_status "Verificando login de Azure..."
if ! az account show &> /dev/null; then
    print_warning "No estás logueado en Azure. Ejecutando az login..."
    az login
fi

# Mostrar suscripción actual
SUBSCRIPTION=$(az account show --query name -o tsv)
print_success "Usando suscripción: $SUBSCRIPTION"

# Crear Resource Group
print_status "Creando Resource Group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location "$LOCATION" --output none
print_success "Resource Group creado"

# 1. Azure Maps
print_status "Creando Azure Maps..."
MAPS_NAME="${APP_NAME}-maps"
az maps account create \
    --resource-group $RESOURCE_GROUP \
    --account-name $MAPS_NAME \
    --sku S1 \
    --location "$LOCATION" \
    --output none

MAPS_KEY=$(az maps account keys list \
    --resource-group $RESOURCE_GROUP \
    --account-name $MAPS_NAME \
    --query primaryKey -o tsv)

print_success "Azure Maps creado. Clave: ${MAPS_KEY:0:10}..."

# 2. Cosmos DB
print_status "Creando Cosmos DB..."
COSMOS_NAME="${APP_NAME}-cosmos"
az cosmosdb create \
    --resource-group $RESOURCE_GROUP \
    --name $COSMOS_NAME \
    --kind GlobalDocumentDB \
    --locations regionName="$LOCATION" failoverPriority=0 \
    --default-consistency-level "Session" \
    --output none

# Crear base de datos
az cosmosdb sql database create \
    --account-name $COSMOS_NAME \
    --resource-group $RESOURCE_GROUP \
    --name EmergencyDB \
    --output none

# Crear contenedores
print_status "Creando contenedores Cosmos DB..."

containers=(
    "Organizations:/organizationType:400"
    "MonitoringZones:/organizationId:400" 
    "FireAlerts:/organizationId:1000"
    "TacticalPlans:/organizationType:400"
    "SatelliteData:/satellite:2000"
    "WeatherData:/location:800"
    "ResourceAllocation:/organizationId:400"
    "AuditLog:/organizationId:400"
)

for container_info in "${containers[@]}"; do
    IFS=':' read -r container_name partition_key throughput <<< "$container_info"
    
    az cosmosdb sql container create \
        --account-name $COSMOS_NAME \
        --resource-group $RESOURCE_GROUP \
        --database-name EmergencyDB \
        --name $container_name \
        --partition-key-path $partition_key \
        --throughput $throughput \
        --output none
    
    print_success "Contenedor $container_name creado"
done

COSMOS_CONNECTION=$(az cosmosdb keys list \
    --name $COSMOS_NAME \
    --resource-group $RESOURCE_GROUP \
    --type connection-strings \
    --query 'connectionStrings[0].connectionString' -o tsv)

# 3. Storage Account
print_status "Creando Storage Account..."
STORAGE_NAME="${APP_NAME}storage$(date +%s | tail -c 6)"
az storage account create \
    --name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --output none

# 4. Function App
print_status "Creando Function App..."
FUNCTION_NAME="${APP_NAME}-functions"
az functionapp create \
    --resource-group $RESOURCE_GROUP \
    --consumption-plan-location "$LOCATION" \
    --runtime node \
    --runtime-version 18 \
    --functions-version 4 \
    --name $FUNCTION_NAME \
    --storage-account $STORAGE_NAME \
    --output none

# 5. Cognitive Services
print_status "Creando Cognitive Services..."
COGNITIVE_NAME="${APP_NAME}-cognitive"
az cognitiveservices account create \
    --name $COGNITIVE_NAME \
    --resource-group $RESOURCE_GROUP \
    --kind CognitiveServices \
    --sku S0 \
    --location "$LOCATION" \
    --output none

COGNITIVE_KEY=$(az cognitiveservices account keys list \
    --name $COGNITIVE_NAME \
    --resource-group $RESOURCE_GROUP \
    --query key1 -o tsv)

COGNITIVE_ENDPOINT=$(az cognitiveservices account show \
    --name $COGNITIVE_NAME \
    --resource-group $RESOURCE_GROUP \
    --query properties.endpoint -o tsv)

# 6. Event Hubs
print_status "Creando Event Hubs..."
EVENTHUB_NAMESPACE="${APP_NAME}-events"
az eventhubs namespace create \
    --resource-group $RESOURCE_GROUP \
    --name $EVENTHUB_NAMESPACE \
    --location "$LOCATION" \
    --sku Standard \
    --output none

az eventhubs eventhub create \
    --resource-group $RESOURCE_GROUP \
    --namespace-name $EVENTHUB_NAMESPACE \
    --name satellite-data \
    --partition-count 4 \
    --message-retention 7 \
    --output none

# 7. Key Vault
print_status "Creando Key Vault..."
KEYVAULT_NAME="${APP_NAME}-vault-$(date +%s | tail -c 6)"
az keyvault create \
    --name $KEYVAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku standard \
    --output none

# Almacenar secretos
az keyvault secret set \
    --vault-name $KEYVAULT_NAME \
    --name "CosmosConnectionString" \
    --value "$COSMOS_CONNECTION" \
    --output none

az keyvault secret set \
    --vault-name $KEYVAULT_NAME \
    --name "AzureMapsKey" \
    --value "$MAPS_KEY" \
    --output none

az keyvault secret set \
    --vault-name $KEYVAULT_NAME \
    --name "CognitiveServicesKey" \
    --value "$COGNITIVE_KEY" \
    --output none

# 8. Application Insights
print_status "Creando Application Insights..."
INSIGHTS_NAME="${APP_NAME}-insights"
az monitor app-insights component create \
    --app $INSIGHTS_NAME \
    --location "$LOCATION" \
    --resource-group $RESOURCE_GROUP \
    --output none

INSIGHTS_KEY=$(az monitor app-insights component show \
    --app $INSIGHTS_NAME \
    --resource-group $RESOURCE_GROUP \
    --query instrumentationKey -o tsv)

# Configurar variables de entorno en Function App
print_status "Configurando variables de entorno..."
az functionapp config appsettings set \
    --name $FUNCTION_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
        "COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION" \
        "AZURE_MAPS_KEY=$MAPS_KEY" \
        "COGNITIVE_SERVICES_ENDPOINT=$COGNITIVE_ENDPOINT" \
        "COGNITIVE_SERVICES_KEY=$COGNITIVE_KEY" \
        "APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY" \
    --output none

# Mostrar resumen
echo ""
echo "🎉 ¡Setup completado exitosamente!"
echo ""
echo "📋 RESUMEN DE RECURSOS CREADOS:"
echo "================================"
echo "Resource Group: $RESOURCE_GROUP"
echo "Azure Maps: $MAPS_NAME"
echo "Cosmos DB: $COSMOS_NAME"
echo "Function App: $FUNCTION_NAME"
echo "Cognitive Services: $COGNITIVE_NAME"
echo "Event Hubs: $EVENTHUB_NAMESPACE"
echo "Key Vault: $KEYVAULT_NAME"
echo "Application Insights: $INSIGHTS_NAME"
echo ""
echo "🔑 CLAVES PARA LA APLICACIÓN:"
echo "============================="
echo "AZURE_MAPS_KEY=$MAPS_KEY"
echo "COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION"
echo "COGNITIVE_SERVICES_ENDPOINT=$COGNITIVE_ENDPOINT"
echo "COGNITIVE_SERVICES_KEY=$COGNITIVE_KEY"
echo "APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY"
echo ""
echo "💰 COSTO ESTIMADO MENSUAL: $150-200 USD"
echo ""
echo "📖 Próximos pasos:"
echo "1. Copia las claves arriba en tu aplicación"
echo "2. Configura NASA FIRMS API key"
echo "3. Despliega las Azure Functions"
echo "4. Configura alertas en Azure Monitor"
echo ""
print_success "¡Tu infraestructura Azure está lista para emergencias! 🚨"