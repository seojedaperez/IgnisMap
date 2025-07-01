// Azure Configuration for Emergency App
// Configuración centralizada de servicios Azure

export interface AzureServicesConfig {
  maps: {
    subscriptionKey: string
    region: string
  }
  cosmos: {
    endpoint: string
    key: string
    databaseName: string
    containers: {
      organizations: string
      monitoringZones: string
      fireAlerts: string
      tacticalPlans: string
      satelliteData: string
      weatherData: string
      resourceAllocation: string
      auditLog: string
    }
  }
  cognitive: {
    endpoint: string
    key: string
    region: string
  }
  openai?: {
    endpoint: string
    key: string
    deployments: {
      gpt4: string
      gpt35: string
      embedding: string
    }
  }
  functions: {
    baseUrl: string
    code?: string
  }
  eventHub: {
    connectionString: string
    hubName: string
  }
  applicationInsights: {
    instrumentationKey: string
    connectionString: string
  }
  keyVault: {
    vaultUrl: string
  }
}

// Default configuration - will be overridden by user settings
export const defaultAzureConfig: Partial<AzureServicesConfig> = {
  cosmos: {
    endpoint: import.meta.env.VITE_AZURE_COSMOS_ENDPOINT || '',
    key: import.meta.env.VITE_AZURE_COSMOS_KEY || '',
    databaseName: 'EmergencyDB',
    containers: {
      organizations: 'Organizations',
      monitoringZones: 'MonitoringZones',
      fireAlerts: 'FireAlerts',
      tacticalPlans: 'TacticalPlans',
      satelliteData: 'SatelliteData',
      weatherData: 'WeatherData',
      resourceAllocation: 'ResourceAllocation',
      auditLog: 'AuditLog'
    }
  },
  maps: {
    subscriptionKey: import.meta.env.VITE_AZURE_MAPS_KEY || '',
    region: 'westeurope'
  },
  cognitive: {
    endpoint: import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT || '',
    key: import.meta.env.VITE_AZURE_COGNITIVE_KEY || '',
    region: 'westeurope'
  },
  eventHub: {
    connectionString: import.meta.env.VITE_AZURE_EVENTHUB_CONNECTION || '',
    hubName: 'satellite-data'
  }
}

// Configuration manager
class AzureConfigManager {
  private config: Partial<AzureServicesConfig> = defaultAzureConfig
  private isConfigured = false

  setConfig(newConfig: Partial<AzureServicesConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.isConfigured = this.validateConfig()
    
    if (this.isConfigured) {
      console.log('✅ Azure services configured successfully')
      this.logConfiguredServices()
    } else {
      console.warn('⚠️ Azure configuration incomplete')
    }
  }

  getConfig(): Partial<AzureServicesConfig> {
    return this.config
  }

  isFullyConfigured(): boolean {
    return this.isConfigured
  }

  private validateConfig(): boolean {
    const required = [
      this.config.maps?.subscriptionKey,
      this.config.cosmos?.endpoint,
      this.config.cosmos?.key,
      this.config.cognitive?.endpoint,
      this.config.cognitive?.key
    ]

    return required.every(item => !!item)
  }

  private logConfiguredServices() {
    const services = []
    if (this.config.maps?.subscriptionKey) services.push('Azure Maps')
    if (this.config.cosmos?.endpoint) services.push('Cosmos DB')
    if (this.config.cognitive?.endpoint) services.push('Cognitive Services')
    if (this.config.openai?.endpoint) services.push('Azure OpenAI')
    if (this.config.functions?.baseUrl) services.push('Azure Functions')
    if (this.config.eventHub?.connectionString) services.push('Event Hubs')
    if (this.config.applicationInsights?.instrumentationKey) services.push('Application Insights')

    console.log(`🚀 Configured services: ${services.join(', ')}`)
  }

  getServiceStatus() {
    return {
      maps: !!this.config.maps?.subscriptionKey,
      cosmos: !!(this.config.cosmos?.endpoint && this.config.cosmos?.key),
      cognitive: !!(this.config.cognitive?.endpoint && this.config.cognitive?.key),
      openai: !!this.config.openai?.endpoint,
      functions: !!this.config.functions?.baseUrl,
      eventHub: !!this.config.eventHub?.connectionString,
      insights: !!this.config.applicationInsights?.instrumentationKey,
      overall: this.isConfigured
    }
  }

  getCostEstimate() {
    const services = this.getServiceStatus()
    let monthlyCost = 0
    const breakdown: { [key: string]: string } = {}

    if (services.maps) {
      monthlyCost += 65 // Average $50-80
      breakdown['Azure Maps'] = '$50-80'
    }
    if (services.cosmos) {
      monthlyCost += 32 // Average $25-40
      breakdown['Cosmos DB'] = '$25-40'
    }
    if (services.cognitive) {
      monthlyCost += 40 // Average $30-50
      breakdown['Cognitive Services'] = '$30-50'
    }
    if (services.openai) {
      monthlyCost += 40 // Average $30-50
      breakdown['Azure OpenAI'] = '$30-50'
    }
    if (services.functions) {
      monthlyCost += 15 // Average $10-20
      breakdown['Azure Functions'] = '$10-20'
    }
    if (services.eventHub) {
      monthlyCost += 40 // Average $30-50
      breakdown['Event Hubs'] = '$30-50'
    }
    if (services.insights) {
      monthlyCost += 10 // Usually free tier
      breakdown['Application Insights'] = '$5-15'
    }

    return {
      monthly: monthlyCost,
      breakdown,
      currency: 'USD',
      note: 'Estimación basada en uso moderado. Costos reales pueden variar.'
    }
  }
}

export const azureConfigManager = new AzureConfigManager()

// Helper function to load config from environment or user input
export const loadAzureConfigFromSetup = (setupData: any) => {
  const config: Partial<AzureServicesConfig> = {
    maps: {
      subscriptionKey: setupData.azureMapsKey || '',
      region: 'westeurope'
    },
    cosmos: {
      endpoint: setupData.cosmosEndpoint || '',
      key: setupData.cosmosKey || '',
      databaseName: 'EmergencyDB',
      containers: defaultAzureConfig.cosmos!.containers
    },
    cognitive: {
      endpoint: setupData.cognitiveEndpoint || '',
      key: setupData.cognitiveKey || '',
      region: 'westeurope'
    },
    functions: {
      baseUrl: setupData.functionsUrl || ''
    },
    applicationInsights: {
      instrumentationKey: setupData.insightsKey || '',
      connectionString: setupData.insightsConnection || ''
    }
  }

  if (setupData.openaiEndpoint) {
    config.openai = {
      endpoint: setupData.openaiEndpoint,
      key: setupData.openaiKey || '',
      deployments: {
        gpt4: 'gpt-4',
        gpt35: 'gpt-35-turbo',
        embedding: 'text-embedding-ada-002'
      }
    }
  }

  azureConfigManager.setConfig(config)
  return config
}