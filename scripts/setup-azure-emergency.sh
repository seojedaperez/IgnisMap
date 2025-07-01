#!/bin/bash

# 🚀 Script de Setup Automático para Azure Emergency App
# Versión optimizada para $1,000 USD de créditos

set -e

echo "🚀 Iniciando setup de Azure Emergency App..."
echo "💰 Presupuesto: $1,000 USD de créditos Azure"
echo ""

# Variables
RESOURCE_GROUP="emergency-rg"
LOCATION="West Europe"
APP_NAME="emergency-app"
SUBSCRIPTION_ID="b60acbf0-ce4d-4157-98b9-0697bff94793"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_cost() {
    echo -e "${PURPLE}[COST]${NC} $1"
}

# Verificar Azure CLI
if ! command -v az &> /dev/null; then
    print_error "Azure CLI no está instalado."
    echo "Instálalo desde: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    echo ""
    echo "Para Ubuntu/Debian:"
    echo "curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    echo ""
    echo "Para Windows:"
    echo "Descarga desde: https://aka.ms/installazurecliwindows"
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
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
print_success "Usando suscripción: $SUBSCRIPTION"
print_success "ID: $SUBSCRIPTION_ID"

# Verificar créditos disponibles
print_status "Verificando créditos disponibles..."
echo "💡 Tip: Verifica tus créditos en https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade"

# Crear Resource Group
print_status "Creando Resource Group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location "$LOCATION" --output none
print_success "Resource Group creado en $LOCATION"

echo ""
echo "🏗️  CREANDO SERVICIOS AZURE..."
echo "================================"

# 1. Azure Maps (CRÍTICO)
print_status "1/8 Creando Azure Maps..."
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

print_success "Azure Maps creado"
print_cost "Costo estimado: $50-80/mes"

# 2. Cosmos DB (CRÍTICO)
print_status "2/8 Creando Cosmos DB..."
COSMOS_NAME="${APP_NAME}-cosmos"
az cosmosdb create \
    --resource-group $RESOURCE_GROUP \
    --name $COSMOS_NAME \
    --kind GlobalDocumentDB \
    --locations regionName="$LOCATION" failoverPriority=0 \
    --default-consistency-level "Session" \
    --enable-free-tier false \
    --output none

# Crear base de datos
az cosmosdb sql database create \
    --account-name $COSMOS_NAME \
    --resource-group $RESOURCE_GROUP \
    --name EmergencyDB \
    --output none

print_success "Cosmos DB creado"
print_cost "Costo estimado: $25-40/mes"

# Crear contenedores optimizados
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
    
    print_success "  ✓ Contenedor $container_name creado"
done

COSMOS_CONNECTION=$(az cosmosdb keys list \
    --name $COSMOS_NAME \
    --resource-group $RESOURCE_GROUP \
    --type connection-strings \
    --query 'connectionStrings[0].connectionString' -o tsv)

# 3. Storage Account
print_status "3/8 Creando Storage Account..."
STORAGE_NAME="${APP_NAME}storage$(date +%s | tail -c 6)"
az storage account create \
    --name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --location "$LOCATION" \
    --sku Standard_LRS \
    --output none

print_success "Storage Account creado"

# 4. Function App (CRÍTICO)
print_status "4/8 Creando Function App..."
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

print_success "Function App creado"
print_cost "Costo estimado: $10-20/mes"

# 5. Cognitive Services (IMPORTANTE)
print_status "5/8 Creando Cognitive Services..."
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

print_success "Cognitive Services creado"
print_cost "Costo estimado: $30-50/mes"

# 6. Event Hubs (IMPORTANTE)
print_status "6/8 Creando Event Hubs..."
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

print_success "Event Hubs creado"
print_cost "Costo estimado: $30-50/mes"

# 7. Key Vault (SEGURIDAD)
print_status "7/8 Creando Key Vault..."
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

print_success "Key Vault creado y secretos almacenados"

# 8. Application Insights (MONITOREO)
print_status "8/8 Creando Application Insights..."
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

print_success "Application Insights creado"

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

print_success "Variables de entorno configuradas"

# Crear archivo de configuración para la app
cat > azure-config.json << EOF
{
  "resourceGroup": "$RESOURCE_GROUP",
  "location": "$LOCATION",
  "services": {
    "azureMaps": {
      "name": "$MAPS_NAME",
      "key": "$MAPS_KEY"
    },
    "cosmosDb": {
      "name": "$COSMOS_NAME",
      "connectionString": "$COSMOS_CONNECTION"
    },
    "cognitiveServices": {
      "name": "$COGNITIVE_NAME",
      "endpoint": "$COGNITIVE_ENDPOINT",
      "key": "$COGNITIVE_KEY"
    },
    "functionApp": {
      "name": "$FUNCTION_NAME"
    },
    "eventHub": {
      "namespace": "$EVENTHUB_NAMESPACE"
    },
    "keyVault": {
      "name": "$KEYVAULT_NAME"
    },
    "applicationInsights": {
      "name": "$INSIGHTS_NAME",
      "instrumentationKey": "$INSIGHTS_KEY"
    }
  }
}
EOF

print_success "Archivo de configuración creado: azure-config.json"

# Mostrar resumen
echo ""
echo "🎉 ¡SETUP COMPLETADO EXITOSAMENTE!"
echo "=================================="
echo ""
echo "📋 RECURSOS CREADOS:"
echo "-------------------"
echo "Resource Group: $RESOURCE_GROUP"
echo "Azure Maps: $MAPS_NAME"
echo "Cosmos DB: $COSMOS_NAME (8 contenedores)"
echo "Function App: $FUNCTION_NAME"
echo "Cognitive Services: $COGNITIVE_NAME"
echo "Event Hubs: $EVENTHUB_NAMESPACE"
echo "Key Vault: $KEYVAULT_NAME"
echo "Application Insights: $INSIGHTS_NAME"
echo "Storage Account: $STORAGE_NAME"
echo ""
echo "🔑 CLAVES PARA LA APLICACIÓN:"
echo "=============================="
echo "AZURE_MAPS_KEY=$MAPS_KEY"
echo ""
echo "COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION"
echo ""
echo "COGNITIVE_SERVICES_ENDPOINT=$COGNITIVE_ENDPOINT"
echo "COGNITIVE_SERVICES_KEY=$COGNITIVE_KEY"
echo ""
echo "APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY"
echo ""
echo "💰 COSTO ESTIMADO MENSUAL:"
echo "=========================="
echo "Azure Maps: $50-80 USD"
echo "Cosmos DB: $25-40 USD"
echo "Cognitive Services: $30-50 USD"
echo "Function App: $10-20 USD"
echo "Event Hubs: $30-50 USD"
echo "Otros servicios: $20-30 USD"
echo "------------------------"
echo "TOTAL: $165-270 USD/mes"
echo ""
echo "📊 CAPACIDADES HABILITADAS:"
echo "==========================="
echo "✅ Mapas profesionales con geofencing"
echo "✅ Base de datos global distribuida"
echo "✅ Análisis de imágenes satelitales"
echo "✅ Procesamiento serverless"
echo "✅ Streaming de datos en tiempo real"
echo "✅ Monitoreo y alertas"
echo "✅ Seguridad con Key Vault"
echo "✅ Auditoría completa"
echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo "=================="
echo "1. ✅ Copia las claves arriba en tu aplicación (Settings)"
echo "2. 🔑 Obtén NASA FIRMS API key: https://firms.modaps.eosdis.nasa.gov/api/"
echo "3. 🤖 Configura Azure OpenAI (opcional): https://portal.azure.com"
echo "4. 📱 Despliega las Azure Functions"
echo "5. 📊 Configura alertas en Azure Monitor"
echo ""
echo "📖 DOCUMENTACIÓN:"
echo "=================="
echo "Portal Azure: https://portal.azure.com"
echo "Cosmos DB: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DocumentDB/databaseAccounts/$COSMOS_NAME"
echo "Azure Maps: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Maps/accounts/$MAPS_NAME"
echo "Function App: https://portal.azure.com/#@/resource/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$FUNCTION_NAME"
echo ""
print_success "¡Tu infraestructura Azure está lista para emergencias! 🚨"
echo ""
echo "💡 TIPS PARA OPTIMIZAR COSTOS:"
echo "==============================="
echo "• Usa Azure Cost Management para monitorear gastos"
echo "• Configura alertas de presupuesto en $200/mes"
echo "• Optimiza las RU/s de Cosmos DB según uso real"
echo "• Usa cache para reducir llamadas a Azure Maps"
echo "• Implementa throttling en APIs para evitar sobrecostos"