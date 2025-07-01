// Service loader with dynamic imports for better code splitting

export const loadAzureService = async () => {
  const { azureService } = await import('./azureService')
  return azureService
}

export const loadAzureMapsService = async () => {
  const { azureMapsService } = await import('./azureMapsService')
  return azureMapsService
}

export const loadPlanetaryComputerService = async () => {
  const { planetaryComputerService } = await import('./planetaryComputerService')
  return planetaryComputerService
}

export const loadEmergencyAnalysisService = async () => {
  const { emergencyAnalysisService } = await import('./emergencyAnalysisService')
  return emergencyAnalysisService
}

export const loadWeatherService = async () => {
  const { weatherService } = await import('./weatherService')
  return weatherService
}

// Preload critical services
export const preloadCriticalServices = async () => {
  try {
    await Promise.all([
      loadEmergencyAnalysisService(),
      loadWeatherService()
    ])
    console.log('✅ Critical services preloaded')
  } catch (error) {
    console.warn('⚠️ Failed to preload some services:', error)
  }
}

// Load services on demand
export const loadServiceOnDemand = async (serviceName: string) => {
  const loaders = {
    azure: loadAzureService,
    azureMaps: loadAzureMapsService,
    planetaryComputer: loadPlanetaryComputerService,
    emergency: loadEmergencyAnalysisService,
    weather: loadWeatherService
  }

  const loader = loaders[serviceName as keyof typeof loaders]
  if (!loader) {
    throw new Error(`Service ${serviceName} not found`)
  }

  return await loader()
}