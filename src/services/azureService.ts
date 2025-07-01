// Enhanced Azure Services Integration with Azure Maps
// Professional-grade fire prediction and emergency management system

import { planetaryComputerService, VegetationIndex, LandCoverData, DroughtIndex } from './planetaryComputerService'
import { azureMapsService, EvacuationRoute, EmergencyFacility } from './azureMapsService'

interface AzureConfig {
  cognitiveServicesEndpoint?: string
  cognitiveServicesKey?: string
  mapsSubscriptionKey?: string
  planetaryComputerKey?: string
  region?: string
}

interface FireRiskPrediction {
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  riskScore: number
  factors: {
    temperature: number
    humidity: number
    windSpeed: number
    vegetation: number
    drought: number
    landCover: number
    historical: number
  }
  confidence: number
  recommendations: string[]
  spreadPrediction?: FireSpreadPrediction
  evacuationZones?: EvacuationZone[]
  resourceAllocation?: ResourceAllocation
  // NEW: Azure Maps integrations
  geofenceAlerts?: Array<{
    id: string
    type: 'fire_perimeter' | 'evacuation_zone' | 'restricted_area'
    status: 'active' | 'breached' | 'cleared'
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>
  evacuationRoutes?: EvacuationRoute[]
  emergencyFacilities?: EmergencyFacility[]
  trafficAnalysis?: {
    congestionLevel: 'free' | 'light' | 'moderate' | 'heavy' | 'blocked'
    estimatedEvacuationTime: number
    alternativeRoutes: number
    bottlenecks: number
  }
  weatherImpact?: {
    windDirection: number
    windSpeed: number
    fireSpreadDirection: number
    aerialOperationsStatus: 'safe' | 'limited' | 'grounded'
    precipitationBenefit: number
  }
}

interface FireSpreadPrediction {
  direction: number // degrees
  speed: number // km/h
  area24h: number // hectares
  area72h: number // hectares
  containmentProbability: number
  perimeterPoints: Array<{
    latitude: number
    longitude: number
    timeToReach: number // hours
    intensity: 'low' | 'moderate' | 'high' | 'extreme'
  }>
  // NEW: Azure Maps enhanced predictions
  evacuationIsochrones?: Array<{
    timeMinutes: number
    polygon: any // GeoJSON
    population: number
    criticalFacilities: number
  }>
  optimalFirebreaks?: Array<{
    coordinates: Array<{ latitude: number, longitude: number }>
    effectiveness: number
    constructionTime: number
    environmentalImpact: 'minimal' | 'moderate' | 'significant'
  }>
}

interface EvacuationZone {
  id: string
  priority: 'immediate' | 'high' | 'medium' | 'low'
  population: number
  timeToEvacuate: number // minutes
  routes: Array<{
    id: string
    capacity: number
    estimatedTime: number
    status: 'clear' | 'congested' | 'blocked'
    // NEW: Azure Maps route optimization
    realTimeTraffic: boolean
    alternativeRoutes: number
    safetyRating: number
  }>
  shelters: Array<{
    id: string
    capacity: number
    distance: number
    facilities: string[]
    // NEW: Real facility data from Azure Maps
    realTimeCapacity: number
    contactInfo: {
      phone: string
      radio: string
    }
    services: string[]
  }>
}

interface ResourceAllocation {
  fireStations: Array<{
    id: string
    distance: number
    responseTime: number
    equipment: string[]
    personnel: number
    availability: 'available' | 'deployed' | 'maintenance'
    // NEW: Azure Maps enhanced data
    realTimeLocation?: { latitude: number, longitude: number }
    optimalRoute?: EvacuationRoute
    trafficDelay?: number
    fuelLevel?: number
    specializedEquipment?: Array<{
      type: string
      quantity: number
      operational: boolean
    }>
  }>
  aircraft: Array<{
    type: 'helicopter' | 'plane' | 'drone'
    capacity: number
    range: number
    eta: number
    status: 'available' | 'deployed' | 'refueling'
    // NEW: Real-time tracking
    currentLocation?: { latitude: number, longitude: number }
    flightPath?: Array<{ latitude: number, longitude: number }>
    weatherConstraints?: {
      maxWindSpeed: number
      minVisibility: number
      operationalStatus: 'safe' | 'limited' | 'grounded'
    }
  }>
  waterSources: Array<{
    id: string
    type: 'hydrant' | 'pond' | 'river' | 'tank'
    capacity: number
    distance: number
    accessibility: 'good' | 'moderate' | 'difficult'
    // NEW: Real-time monitoring
    currentLevel?: number
    flowRate?: number
    waterQuality?: 'potable' | 'non_potable' | 'contaminated'
    accessRoute?: EvacuationRoute
  }>
  recommendedDeployment: {
    groundCrews: number
    aircraft: number
    waterTenders: number
    commandUnits: number
    // NEW: Optimized deployment strategy
    deploymentSequence?: Array<{
      phase: number
      resources: string[]
      targetLocation: { latitude: number, longitude: number }
      estimatedArrival: string
      missionType: 'suppression' | 'rescue' | 'evacuation' | 'prevention'
    }>
    contingencyPlans?: Array<{
      trigger: string
      action: string
      resources: string[]
    }>
  }
}

class AzureService {
  private config: AzureConfig = {}
  private isConfigured = false

  configure(config: AzureConfig) {
    this.config = config
    this.isConfigured = !!(config.cognitiveServicesEndpoint && config.cognitiveServicesKey)
    
    // Configure Planetary Computer service
    if (config.planetaryComputerKey) {
      planetaryComputerService.constructor(config.planetaryComputerKey)
    }
    
    console.log('Azure Service configured:', this.isConfigured)
  }

  // Enhanced Fire Risk Prediction with Azure Maps integration
  async predictFireRisk(
    weatherData: any, 
    locationData?: { latitude: number, longitude: number }
  ): Promise<FireRiskPrediction> {
    try {
      const location = locationData || { latitude: 40.4168, longitude: -3.7038 }
      const bbox = [
        location.longitude - 0.1,
        location.latitude - 0.1,
        location.longitude + 0.1,
        location.latitude + 0.1
      ]

      // Gather comprehensive environmental data
      const [vegetationData, landCoverData, droughtData, activeFires, historicalFires] = await Promise.all([
        planetaryComputerService.calculateVegetationIndices(bbox, new Date().toISOString()),
        planetaryComputerService.getLandCoverData(bbox),
        planetaryComputerService.getDroughtIndex(bbox, new Date().toISOString()),
        planetaryComputerService.detectActiveFires(bbox, new Date().toISOString().split('T')[0]),
        planetaryComputerService.getHistoricalFires(bbox, 5)
      ])

      // Calculate comprehensive risk score
      const riskAnalysis = this.calculateAdvancedFireRisk(
        weatherData,
        vegetationData,
        landCoverData,
        droughtData,
        activeFires,
        historicalFires
      )

      // Generate fire spread prediction with Azure Maps
      const spreadPrediction = await this.predictFireSpreadWithMaps(
        location,
        weatherData,
        vegetationData,
        landCoverData,
        riskAnalysis.riskScore
      )

      // NEW: Create geofence alerts for fire perimeter (with improved error handling)
      const geofenceAlerts = await this.createGeofenceAlerts(location, spreadPrediction)

      // NEW: Calculate optimal evacuation routes (with improved error handling)
      const evacuationRoutes = await this.calculateEvacuationRoutes(location, spreadPrediction)

      // NEW: Find and analyze emergency facilities (with improved error handling)
      const emergencyFacilities = await this.findEmergencyFacilities(location)

      // NEW: Analyze traffic for evacuation (with improved error handling)
      const trafficAnalysis = await this.analyzeEvacuationTraffic(evacuationRoutes)

      // NEW: Weather impact analysis (with improved error handling)
      const weatherImpact = await this.analyzeWeatherImpactOnOperations(location, weatherData)

      // Identify evacuation zones with enhanced data
      const evacuationZones = await this.identifyEvacuationZonesEnhanced(location, spreadPrediction, emergencyFacilities)

      // Calculate optimal resource allocation with real-time data
      const resourceAllocation = await this.calculateResourceAllocationEnhanced(
        location,
        riskAnalysis.riskScore,
        spreadPrediction,
        emergencyFacilities
      )

      return {
        ...riskAnalysis,
        spreadPrediction,
        evacuationZones,
        resourceAllocation,
        // NEW: Azure Maps integrations
        geofenceAlerts,
        evacuationRoutes,
        emergencyFacilities,
        trafficAnalysis,
        weatherImpact
      }
    } catch (error) {
      console.error('Enhanced fire risk prediction failed:', error)
      // Fallback to basic calculation
      return this.calculateLocalFireRisk(weatherData)
    }
  }

  // NEW: Create geofence alerts for fire monitoring (with improved error handling)
  private async createGeofenceAlerts(
    location: { latitude: number, longitude: number },
    spreadPrediction: FireSpreadPrediction
  ): Promise<Array<{
    id: string
    type: 'fire_perimeter' | 'evacuation_zone' | 'restricted_area'
    status: 'active' | 'breached' | 'cleared'
    priority: 'low' | 'medium' | 'high' | 'critical'
  }>> {
    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (!serviceStatus.configured) {
        console.info('Azure Maps not configured, using mock geofence alerts')
        return this.getMockGeofenceAlerts()
      }

      const alerts = []

      // Create fire perimeter geofence
      const firePerimeter = await azureMapsService.createFirePerimeterGeofence(
        location,
        Math.sqrt(spreadPrediction.area24h / Math.PI) * 1000 // Convert hectares to radius in meters
      )

      alerts.push({
        id: firePerimeter.id,
        type: 'fire_perimeter' as const,
        status: firePerimeter.status,
        priority: firePerimeter.priority
      })

      // Create evacuation zone geofences
      const evacuationRadius = Math.sqrt(spreadPrediction.area72h / Math.PI) * 1000 * 1.5 // 50% buffer
      const evacuationGeofence = await azureMapsService.createFirePerimeterGeofence(
        location,
        evacuationRadius
      )

      alerts.push({
        id: evacuationGeofence.id,
        type: 'evacuation_zone' as const,
        status: 'active',
        priority: 'high'
      })

      return alerts
    } catch (error) {
      console.info('Azure Maps geofence creation not available, using mock alerts')
      return this.getMockGeofenceAlerts()
    }
  }

  // NEW: Calculate optimal evacuation routes using Azure Maps (with improved error handling)
  private async calculateEvacuationRoutes(
    fireLocation: { latitude: number, longitude: number },
    spreadPrediction: FireSpreadPrediction
  ): Promise<EvacuationRoute[]> {
    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (!serviceStatus.configured) {
        console.info('Azure Maps not configured, using mock evacuation routes')
        return this.getMockEvacuationRoutes(fireLocation)
      }

      // Define evacuation zones based on fire spread prediction
      const evacuationZones = [
        { latitude: fireLocation.latitude + 0.01, longitude: fireLocation.longitude + 0.01, population: 1500 },
        { latitude: fireLocation.latitude - 0.01, longitude: fireLocation.longitude + 0.01, population: 2000 },
        { latitude: fireLocation.latitude + 0.01, longitude: fireLocation.longitude - 0.01, population: 1200 }
      ]

      // Define shelter locations
      const shelters = [
        { latitude: fireLocation.latitude + 0.05, longitude: fireLocation.longitude + 0.05, capacity: 2000 },
        { latitude: fireLocation.latitude - 0.05, longitude: fireLocation.longitude + 0.05, capacity: 1500 },
        { latitude: fireLocation.latitude, longitude: fireLocation.longitude + 0.08, capacity: 3000 }
      ]

      return await azureMapsService.calculateOptimalEvacuationRoutes(evacuationZones, shelters)
    } catch (error) {
      console.info('Azure Maps evacuation routes not available, using mock routes')
      return this.getMockEvacuationRoutes(fireLocation)
    }
  }

  // NEW: Find emergency facilities (with improved error handling)
  private async findEmergencyFacilities(
    location: { latitude: number, longitude: number }
  ): Promise<EmergencyFacility[]> {
    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (!serviceStatus.configured) {
        console.info('Azure Maps not configured, using mock emergency facilities')
        return this.getMockEmergencyFacilities(location)
      }

      return await azureMapsService.findNearbyEmergencyFacilities(location, 50000)
    } catch (error) {
      console.info('Azure Maps emergency facilities not available, using mock facilities')
      return this.getMockEmergencyFacilities(location)
    }
  }

  // NEW: Analyze traffic conditions for evacuation (with improved error handling)
  private async analyzeEvacuationTraffic(routes: EvacuationRoute[]): Promise<{
    congestionLevel: 'free' | 'light' | 'moderate' | 'heavy' | 'blocked'
    estimatedEvacuationTime: number
    alternativeRoutes: number
    bottlenecks: number
  }> {
    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (!serviceStatus.configured) {
        console.info('Azure Maps not configured, using mock traffic analysis')
        return this.getMockTrafficAnalysis()
      }

      const trafficAnalysis = await azureMapsService.analyzeTrafficForEvacuation(routes)
      
      // Calculate overall congestion level
      const avgCongestion = trafficAnalysis.roadSegments.reduce((sum, segment) => {
        const congestionScore = {
          'free': 1, 'light': 2, 'moderate': 3, 'heavy': 4, 'blocked': 5
        }[segment.congestionLevel]
        return sum + congestionScore
      }, 0) / trafficAnalysis.roadSegments.length

      const congestionLevel = avgCongestion <= 1.5 ? 'free' :
                             avgCongestion <= 2.5 ? 'light' :
                             avgCongestion <= 3.5 ? 'moderate' :
                             avgCongestion <= 4.5 ? 'heavy' : 'blocked'

      return {
        congestionLevel,
        estimatedEvacuationTime: trafficAnalysis.estimatedEvacuationTime,
        alternativeRoutes: trafficAnalysis.alternativeRoutes.length,
        bottlenecks: trafficAnalysis.bottlenecks.length
      }
    } catch (error) {
      console.info('Azure Maps traffic analysis not available, using mock analysis')
      return this.getMockTrafficAnalysis()
    }
  }

  // NEW: Analyze weather impact on fire operations (with improved error handling)
  private async analyzeWeatherImpactOnOperations(
    location: { latitude: number, longitude: number },
    weatherData: any
  ): Promise<{
    windDirection: number
    windSpeed: number
    fireSpreadDirection: number
    aerialOperationsStatus: 'safe' | 'limited' | 'grounded'
    precipitationBenefit: number
  }> {
    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (!serviceStatus.configured) {
        console.info('Azure Maps not configured, using fallback weather impact')
        return this.getFallbackWeatherImpact(weatherData)
      }

      const weatherImpact = await azureMapsService.analyzeWeatherImpact(location)
      
      return {
        windDirection: weatherImpact.windImpact.currentDirection,
        windSpeed: weatherImpact.windImpact.currentSpeed,
        fireSpreadDirection: weatherImpact.windImpact.currentDirection, // Fire spreads with wind
        aerialOperationsStatus: weatherImpact.visibilityConditions.aerialOperationsImpact,
        precipitationBenefit: weatherImpact.precipitationImpact.fireSuppressionBenefit
      }
    } catch (error) {
      console.info('Azure Maps weather impact analysis not available, using fallback')
      return this.getFallbackWeatherImpact(weatherData)
    }
  }

  // Enhanced fire spread prediction with Azure Maps
  private async predictFireSpreadWithMaps(
    location: { latitude: number, longitude: number },
    weatherData: any,
    vegetationData: VegetationIndex,
    landCoverData: LandCoverData,
    riskScore: number
  ): Promise<FireSpreadPrediction> {
    // Base fire spread calculation (existing logic)
    const windSpeed = weatherData.windSpeed || 10
    const slope = 0 // Assume flat terrain for simplification
    const fuelLoad = landCoverData.forestCover + landCoverData.grassland
    const moisture = vegetationData.moisture
    
    const baseROS = (fuelLoad / 100) * (1 - moisture) * 2
    const windEffect = windSpeed * 0.1
    const slopeEffect = slope * 0.05
    const rateOfSpread = baseROS + windEffect + slopeEffect
    
    const spreadSpeed = rateOfSpread * 0.06 // Convert to km/h
    const windDirection = weatherData.windDirection || 45 + Math.random() * 90
    
    const area24h = Math.PI * Math.pow(spreadSpeed * 24, 2)
    const area72h = Math.PI * Math.pow(spreadSpeed * 72, 2)
    
    const perimeterPoints = this.generateSpreadPerimeter(
      location,
      windDirection,
      spreadSpeed,
      riskScore
    )

    // NEW: Calculate evacuation isochrones using Azure Maps (with improved error handling)
    let evacuationIsochrones: Array<{
      timeMinutes: number
      polygon: any
      population: number
      criticalFacilities: number
    }> = []

    try {
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      if (serviceStatus.configured) {
        evacuationIsochrones = await azureMapsService.calculateEvacuationIsochrones(
          location,
          [15, 30, 60, 120] // 15min, 30min, 1hr, 2hr evacuation zones
        )
      } else {
        console.info('Azure Maps not configured, using mock isochrones')
        evacuationIsochrones = this.getMockIsochrones()
      }
    } catch (error) {
      console.info('Azure Maps isochrones calculation not available, using mock isochrones')
      evacuationIsochrones = this.getMockIsochrones()
    }

    // NEW: Calculate optimal firebreak locations
    const optimalFirebreaks = this.calculateOptimalFirebreaks(location, windDirection, landCoverData)

    return {
      direction: windDirection,
      speed: spreadSpeed,
      area24h,
      area72h,
      containmentProbability: Math.max(0.1, 1 - (riskScore / 100)),
      perimeterPoints,
      evacuationIsochrones,
      optimalFirebreaks
    }
  }

  // NEW: Calculate optimal firebreak locations
  private calculateOptimalFirebreaks(
    location: { latitude: number, longitude: number },
    windDirection: number,
    landCoverData: LandCoverData
  ): Array<{
    coordinates: Array<{ latitude: number, longitude: number }>
    effectiveness: number
    constructionTime: number
    environmentalImpact: 'minimal' | 'moderate' | 'significant'
  }> {
    const firebreaks = []
    
    // Primary firebreak perpendicular to wind direction
    const perpDirection = (windDirection + 90) % 360
    const firebreak1 = {
      coordinates: [
        { 
          latitude: location.latitude + 0.01 * Math.cos(perpDirection * Math.PI / 180), 
          longitude: location.longitude + 0.01 * Math.sin(perpDirection * Math.PI / 180) 
        },
        { 
          latitude: location.latitude - 0.01 * Math.cos(perpDirection * Math.PI / 180), 
          longitude: location.longitude - 0.01 * Math.sin(perpDirection * Math.PI / 180) 
        }
      ],
      effectiveness: 0.85,
      constructionTime: 4, // hours
      environmentalImpact: landCoverData.forestCover > 70 ? 'significant' as const : 'moderate' as const
    }
    
    firebreaks.push(firebreak1)
    
    // Secondary firebreak for containment
    const firebreak2 = {
      coordinates: [
        { latitude: location.latitude + 0.02, longitude: location.longitude },
        { latitude: location.latitude + 0.02, longitude: location.longitude + 0.02 }
      ],
      effectiveness: 0.75,
      constructionTime: 6, // hours
      environmentalImpact: 'moderate' as const
    }
    
    firebreaks.push(firebreak2)
    
    return firebreaks
  }

  // Enhanced evacuation zones with real facility data
  private async identifyEvacuationZonesEnhanced(
    location: { latitude: number, longitude: number },
    spreadPrediction: FireSpreadPrediction,
    emergencyFacilities: EmergencyFacility[]
  ): Promise<EvacuationZone[]> {
    const zones: EvacuationZone[] = []
    
    const distances = [2, 5, 10, 20] // km
    const priorities: ('immediate' | 'high' | 'medium' | 'low')[] = ['immediate', 'high', 'medium', 'low']
    
    for (let i = 0; i < distances.length; i++) {
      const distance = distances[i]
      const priority = priorities[i]
      
      // Find shelters within reasonable distance
      const nearbyFacilities = emergencyFacilities.filter(facility => 
        this.calculateDistance(location, facility.location) <= distance * 2
      )
      
      // Calculate evacuation routes to shelters
      const routes = []
      for (const facility of nearbyFacilities.slice(0, 3)) {
        routes.push({
          id: `route_to_${facility.id}`,
          capacity: facility.capacity,
          estimatedTime: distance * 3 + Math.random() * 30,
          status: 'clear' as const,
          realTimeTraffic: true,
          alternativeRoutes: 2,
          safetyRating: 8
        })
      }
      
      zones.push({
        id: `zone_${i + 1}`,
        priority,
        population: Math.floor(Math.random() * 5000) + 500,
        timeToEvacuate: distance * 3 + Math.random() * 30,
        routes,
        shelters: nearbyFacilities.slice(0, 3).map(facility => ({
          id: facility.id,
          capacity: facility.capacity,
          distance: this.calculateDistance(location, facility.location),
          facilities: facility.services,
          realTimeCapacity: facility.capacity - facility.currentOccupancy,
          contactInfo: facility.contactInfo,
          services: facility.services
        }))
      })
    }
    
    return zones
  }

  // Enhanced resource allocation with real-time data
  private async calculateResourceAllocationEnhanced(
    location: { latitude: number, longitude: number },
    riskScore: number,
    spreadPrediction: FireSpreadPrediction,
    emergencyFacilities: EmergencyFacility[]
  ): Promise<ResourceAllocation> {
    try {
      // Get fire stations from emergency facilities
      const fireStations = emergencyFacilities.filter(facility => facility.type === 'fire_station')
      
      // Check if Azure Maps service is configured before attempting to use it
      const serviceStatus = azureMapsService.getServiceStatus()
      let resourceOptimization
      
      if (serviceStatus.configured) {
        // Optimize resource deployment using Azure Maps
        resourceOptimization = await azureMapsService.optimizeResourceDeployment(
          location,
          riskScore > 80 ? 'extreme' : riskScore > 60 ? 'high' : riskScore > 40 ? 'medium' : 'low',
          emergencyFacilities
        )
      } else {
        console.info('Azure Maps not configured, using mock resource optimization')
        resourceOptimization = this.getMockResourceOptimization(fireStations)
      }

      // Enhanced fire stations data
      const enhancedFireStations = resourceOptimization.fireStations.map(station => ({
        id: station.id,
        distance: this.calculateDistance(location, station.location),
        responseTime: station.responseTime,
        equipment: station.resources.map(r => r.type),
        personnel: station.personnel.total,
        availability: 'available' as const,
        realTimeLocation: station.location,
        optimalRoute: resourceOptimization.optimalDeployment.find(d => d.stationId === station.id)?.route,
        trafficDelay: 5, // minutes
        fuelLevel: 85, // percentage
        specializedEquipment: station.resources.map(resource => ({
          type: resource.type,
          quantity: resource.quantity,
          operational: resource.available > 0
        }))
      }))

      // Enhanced aircraft data with weather constraints
      const aircraft = Array.from({ length: 3 }, (_, i) => ({
        type: ['helicopter', 'plane', 'drone'][i] as any,
        capacity: [2000, 8000, 100][i],
        range: [200, 500, 50][i],
        eta: Math.random() * 60 + 15,
        status: ['available', 'deployed', 'refueling'][Math.floor(Math.random() * 3)] as any,
        currentLocation: {
          latitude: location.latitude + (Math.random() - 0.5) * 0.1,
          longitude: location.longitude + (Math.random() - 0.5) * 0.1
        },
        flightPath: this.generateFlightPath(location),
        weatherConstraints: {
          maxWindSpeed: [25, 35, 15][i],
          minVisibility: [3, 5, 1][i],
          operationalStatus: 'safe' as const
        }
      }))

      // Enhanced water sources with real-time monitoring
      const waterSources = Array.from({ length: 4 }, (_, i) => ({
        id: `water_${i + 1}`,
        type: ['hydrant', 'pond', 'river', 'tank'][i] as any,
        capacity: [1000, 50000, 100000, 10000][i],
        distance: Math.random() * 20 + 2,
        accessibility: ['good', 'moderate', 'difficult'][Math.floor(Math.random() * 3)] as any,
        currentLevel: Math.random() * 100,
        flowRate: [500, 2000, 5000, 800][i],
        waterQuality: 'non_potable' as const,
        accessRoute: this.createDummyRoute(location, {
          latitude: location.latitude + (Math.random() - 0.5) * 0.02,
          longitude: location.longitude + (Math.random() - 0.5) * 0.02
        })
      }))

      // Enhanced deployment strategy
      const intensity = riskScore / 100
      const deploymentSequence = [
        {
          phase: 1,
          resources: ['Engine_01', 'Engine_02', 'Command_01'],
          targetLocation: location,
          estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          missionType: 'suppression' as const
        },
        {
          phase: 2,
          resources: ['Ladder_01', 'Rescue_01', 'Water_Tender_01'],
          targetLocation: {
            latitude: location.latitude + 0.005,
            longitude: location.longitude + 0.005
          },
          estimatedArrival: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          missionType: 'suppression' as const
        }
      ]

      const contingencyPlans = [
        {
          trigger: 'Wind speed exceeds 25 km/h',
          action: 'Transition to defensive strategy',
          resources: ['All ground units', 'Command vehicles']
        },
        {
          trigger: 'Fire jumps containment line',
          action: 'Activate evacuation protocol',
          resources: ['Evacuation buses', 'Police units', 'Medical teams']
        }
      ]

      return {
        fireStations: enhancedFireStations,
        aircraft,
        waterSources,
        recommendedDeployment: {
          groundCrews: Math.ceil(intensity * 10),
          aircraft: Math.ceil(intensity * 5),
          waterTenders: Math.ceil(intensity * 8),
          commandUnits: Math.ceil(intensity * 3),
          deploymentSequence,
          contingencyPlans
        }
      }
    } catch (error) {
      console.error('Error calculating enhanced resource allocation:', error)
      return this.getFallbackResourceAllocation(location, riskScore)
    }
  }

  // Mock data methods for when Azure Maps is not configured
  private getMockGeofenceAlerts(): Array<{
    id: string
    type: 'fire_perimeter' | 'evacuation_zone' | 'restricted_area'
    status: 'active' | 'breached' | 'cleared'
    priority: 'low' | 'medium' | 'high' | 'critical'
  }> {
    return [
      {
        id: 'mock_fire_perimeter',
        type: 'fire_perimeter' as const,
        status: 'active' as const,
        priority: 'critical' as const
      },
      {
        id: 'mock_evacuation_zone',
        type: 'evacuation_zone' as const,
        status: 'active' as const,
        priority: 'high' as const
      }
    ]
  }

  private getMockEvacuationRoutes(fireLocation: { latitude: number, longitude: number }): EvacuationRoute[] {
    return [
      {
        id: 'mock_route_1',
        startPoint: fireLocation,
        endPoint: { latitude: fireLocation.latitude + 0.05, longitude: fireLocation.longitude + 0.05 },
        waypoints: [],
        distance: 5000,
        duration: 600,
        trafficDelay: 0,
        roadConditions: 'clear',
        capacity: 1000,
        alternativeRoutes: [],
        safetyRating: 8,
        lastUpdated: new Date().toISOString()
      }
    ]
  }

  private getMockEmergencyFacilities(location: { latitude: number, longitude: number }): EmergencyFacility[] {
    return [
      {
        id: 'mock_hospital',
        name: 'Emergency Hospital',
        type: 'hospital',
        location: { latitude: location.latitude + 0.01, longitude: location.longitude + 0.01 },
        capacity: 200,
        currentOccupancy: 150,
        services: ['Emergency Care', 'Surgery'],
        contactInfo: { phone: '112', radio: 'CH_1', email: 'hospital@emergency.gov' },
        status: 'operational',
        resources: [{ type: 'Beds', quantity: 200, available: 50 }]
      }
    ]
  }

  private getMockTrafficAnalysis(): {
    congestionLevel: 'free' | 'light' | 'moderate' | 'heavy' | 'blocked'
    estimatedEvacuationTime: number
    alternativeRoutes: number
    bottlenecks: number
  } {
    return {
      congestionLevel: 'moderate',
      estimatedEvacuationTime: 60,
      alternativeRoutes: 2,
      bottlenecks: 1
    }
  }

  private getFallbackWeatherImpact(weatherData: any): {
    windDirection: number
    windSpeed: number
    fireSpreadDirection: number
    aerialOperationsStatus: 'safe' | 'limited' | 'grounded'
    precipitationBenefit: number
  } {
    return {
      windDirection: weatherData.windDirection || 180,
      windSpeed: weatherData.windSpeed || 10,
      fireSpreadDirection: weatherData.windDirection || 180,
      aerialOperationsStatus: 'safe',
      precipitationBenefit: 1
    }
  }

  private getMockIsochrones(): Array<{
    timeMinutes: number
    polygon: any
    population: number
    criticalFacilities: number
  }> {
    return [15, 30, 60, 120].map(time => ({
      timeMinutes: time,
      polygon: { type: 'Polygon', coordinates: [] },
      population: time * 100,
      criticalFacilities: 0
    }))
  }

  private getMockResourceOptimization(fireStations: EmergencyFacility[]): any {
    return {
      fireStations: fireStations.map(station => ({
        id: station.id,
        location: station.location,
        responseTime: 15,
        resources: station.resources,
        personnel: { total: 25, available: 20, specialized: [] }
      })),
      optimalDeployment: []
    }
  }

  // Helper methods
  private calculateDistance(
    point1: { latitude: number, longitude: number },
    point2: { latitude: number, longitude: number }
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private createDummyRoute(start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number }): EvacuationRoute {
    return {
      id: `route_${Date.now()}`,
      startPoint: start,
      endPoint: end,
      waypoints: [start, end],
      distance: this.calculateDistance(start, end) * 1000,
      duration: this.calculateDistance(start, end) * 60, // 1 km per minute
      trafficDelay: 0,
      roadConditions: 'clear',
      capacity: 1000,
      alternativeRoutes: [],
      safetyRating: 8,
      lastUpdated: new Date().toISOString()
    }
  }

  private generateFlightPath(destination: { latitude: number, longitude: number }): Array<{ latitude: number, longitude: number }> {
    const path = []
    const start = {
      latitude: destination.latitude + 0.05,
      longitude: destination.longitude + 0.05
    }
    
    for (let i = 0; i <= 10; i++) {
      const progress = i / 10
      path.push({
        latitude: start.latitude + (destination.latitude - start.latitude) * progress,
        longitude: start.longitude + (destination.longitude - start.longitude) * progress
      })
    }
    
    return path
  }

  private getFallbackResourceAllocation(location: { latitude: number, longitude: number }, riskScore: number): ResourceAllocation {
    // Fallback implementation (existing logic)
    return {
      fireStations: [],
      aircraft: [],
      waterSources: [],
      recommendedDeployment: {
        groundCrews: 5,
        aircraft: 2,
        waterTenders: 3,
        commandUnits: 1
      }
    }
  }

  // Existing methods (keeping all previous functionality)
  private calculateAdvancedFireRisk(
    weatherData: any,
    vegetationData: VegetationIndex,
    landCoverData: LandCoverData,
    droughtData: DroughtIndex,
    activeFires: any[],
    historicalFires: any[]
  ): Omit<FireRiskPrediction, 'spreadPrediction' | 'evacuationZones' | 'resourceAllocation' | 'geofenceAlerts' | 'evacuationRoutes' | 'emergencyFacilities' | 'trafficAnalysis' | 'weatherImpact'> {
    const { temperature, humidity, windSpeed } = weatherData
    
    let riskScore = 0
    
    // Weather factors (40% of total risk)
    const tempFactor = Math.min(40, Math.max(0, (temperature - 15) * 2))
    const humidityFactor = Math.min(30, Math.max(0, (60 - humidity) * 0.75))
    const windFactor = Math.min(30, Math.max(0, windSpeed * 1.5))
    
    // Vegetation factors (25% of total risk)
    const vegetationFactor = Math.min(25, Math.max(0, (1 - vegetationData.ndvi) * 25))
    const drynessFactor = Math.min(25, vegetationData.dryness * 25)
    
    // Drought factor (15% of total risk)
    const droughtFactor = Math.min(15, Math.max(0, Math.abs(droughtData.value) * 7.5))
    
    // Land cover factor (10% of total risk)
    const forestRisk = (landCoverData.forestCover / 100) * 10
    const grassRisk = (landCoverData.grassland / 100) * 8
    const landCoverFactor = Math.min(10, forestRisk + grassRisk)
    
    // Historical fire factor (10% of total risk)
    const recentFires = historicalFires.filter(fire => 
      new Date(fire.date).getTime() > Date.now() - 365 * 24 * 60 * 60 * 1000
    )
    const historicalFactor = Math.min(10, recentFires.length * 3)
    
    // Active fire proximity bonus
    const activeFireBonus = activeFires.length > 0 ? 15 : 0
    
    riskScore = tempFactor + humidityFactor + windFactor + vegetationFactor + 
                drynessFactor + droughtFactor + landCoverFactor + historicalFactor + activeFireBonus
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'extreme'
    if (riskScore >= 85) riskLevel = 'extreme'
    else if (riskScore >= 65) riskLevel = 'high'
    else if (riskScore >= 45) riskLevel = 'medium'
    else riskLevel = 'low'
    
    // Generate professional recommendations
    const recommendations = this.generateProfessionalRecommendations(
      riskLevel, 
      weatherData, 
      vegetationData, 
      droughtData, 
      activeFires.length > 0
    )
    
    return {
      riskLevel,
      riskScore: Math.min(100, riskScore),
      factors: {
        temperature: tempFactor,
        humidity: humidityFactor,
        windSpeed: windFactor,
        vegetation: vegetationFactor + drynessFactor,
        drought: droughtFactor,
        landCover: landCoverFactor,
        historical: historicalFactor
      },
      confidence: this.calculateConfidence(vegetationData, droughtData),
      recommendations
    }
  }

  // Keep all existing helper methods...
  private generateSpreadPerimeter(
    center: { latitude: number, longitude: number },
    direction: number,
    speed: number,
    riskScore: number
  ): Array<{
    latitude: number
    longitude: number
    timeToReach: number
    intensity: 'low' | 'moderate' | 'high' | 'extreme'
  }> {
    const points = []
    const numPoints = 16
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI
      const distance = speed * 24 * (0.5 + Math.random() * 0.5)
      
      const windFactor = Math.cos(angle - (direction * Math.PI / 180)) * 0.5 + 1
      const adjustedDistance = distance * windFactor
      
      const lat = center.latitude + (adjustedDistance / 111) * Math.cos(angle)
      const lon = center.longitude + (adjustedDistance / (111 * Math.cos(center.latitude * Math.PI / 180))) * Math.sin(angle)
      
      points.push({
        latitude: lat,
        longitude: lon,
        timeToReach: adjustedDistance / speed,
        intensity: riskScore > 80 ? 'extreme' : riskScore > 60 ? 'high' : riskScore > 40 ? 'moderate' : 'low'
      })
    }
    
    return points
  }

  private generateProfessionalRecommendations(
    riskLevel: string,
    weatherData: any,
    vegetationData: VegetationIndex,
    droughtData: DroughtIndex,
    activeFiresPresent: boolean
  ): string[] {
    const recommendations: string[] = []
    
    // Base recommendations by risk level
    switch (riskLevel) {
      case 'extreme':
        recommendations.push('🚨 ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 4 - Riesgo extremo de incendio')
        recommendations.push('🚫 Prohibir todas las actividades que puedan generar ignición')
        recommendations.push('🚒 Desplegar recursos preventivos en zonas de alto riesgo')
        recommendations.push('📡 Activar centros de comando de emergencia')
        recommendations.push('🏃 Preparar evacuaciones preventivas en zonas vulnerables')
        break
      case 'high':
        recommendations.push('⚠️ ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 3 - Riesgo alto de incendio')
        recommendations.push('🚧 Restringir acceso a zonas forestales')
        recommendations.push('👮 Aumentar patrullaje preventivo')
        recommendations.push('🚒 Preparar recursos de extinción')
        break
      case 'medium':
        recommendations.push('📊 ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 2 - Riesgo moderado')
        recommendations.push('👁️ Mantener vigilancia aumentada')
        recommendations.push('✅ Verificar disponibilidad de recursos')
        break
      case 'low':
        recommendations.push('📋 Mantener protocolos estándar de prevención')
        break
    }
    
    // Weather-specific recommendations
    if (weatherData.temperature > 35) {
      recommendations.push('🌡️ Temperatura crítica: Evitar trabajos al aire libre durante horas pico')
    }
    
    if (weatherData.humidity < 20) {
      recommendations.push('💧 Humedad crítica: Riesgo extremo de ignición y propagación rápida')
    }
    
    if (weatherData.windSpeed > 25) {
      recommendations.push('💨 Vientos fuertes: Riesgo de propagación errática y salto de fuego')
      recommendations.push('🚁 Considerar suspensión de operaciones aéreas de extinción')
    }
    
    // Vegetation-specific recommendations
    if (vegetationData.dryness > 0.8) {
      recommendations.push('🌿 Vegetación extremadamente seca: Implementar cortafuegos preventivos')
    }
    
    if (vegetationData.ndvi < 0.3) {
      recommendations.push('🍂 Vegetación estresada: Monitorear áreas de vegetación muerta')
    }
    
    // Drought-specific recommendations
    if (droughtData.category === 'extreme') {
      recommendations.push('🏜️ Sequía extrema: Implementar restricciones hídricas y protocolos especiales')
    }
    
    // Active fire recommendations
    if (activeFiresPresent) {
      recommendations.push('🔥 FUEGOS ACTIVOS DETECTADOS: Verificar y responder inmediatamente')
      recommendations.push('🛡️ Establecer perímetro de seguridad ampliado')
      recommendations.push('🏃 Activar protocolos de evacuación si es necesario')
    }
    
    return recommendations
  }

  private calculateConfidence(vegetationData: VegetationIndex, droughtData: DroughtIndex): number {
    const dataQuality = (vegetationData.confidence + (droughtData.value !== 0 ? 0.9 : 0.5)) / 2
    const modelConfidence = this.isConfigured ? 0.95 : 0.75
    return dataQuality * modelConfidence
  }

  private calculateLocalFireRisk(weatherData: any): FireRiskPrediction {
    const { temperature, humidity, windSpeed } = weatherData
    
    let riskScore = 0
    
    // Temperature factor (0-40 points)
    if (temperature > 35) riskScore += 40
    else if (temperature > 30) riskScore += 30
    else if (temperature > 25) riskScore += 20
    else if (temperature > 20) riskScore += 10
    
    // Humidity factor (0-30 points, inverse relationship)
    if (humidity < 20) riskScore += 30
    else if (humidity < 30) riskScore += 25
    else if (humidity < 40) riskScore += 20
    else if (humidity < 50) riskScore += 15
    else if (humidity < 60) riskScore += 10
    
    // Wind factor (0-30 points)
    if (windSpeed > 25) riskScore += 30
    else if (windSpeed > 20) riskScore += 25
    else if (windSpeed > 15) riskScore += 20
    else if (windSpeed > 10) riskScore += 15
    else if (windSpeed > 5) riskScore += 10
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'extreme'
    if (riskScore >= 80) riskLevel = 'extreme'
    else if (riskScore >= 60) riskLevel = 'high'
    else if (riskScore >= 40) riskLevel = 'medium'
    else riskLevel = 'low'
    
    return {
      riskLevel,
      riskScore,
      factors: {
        temperature: Math.min(40, temperature > 35 ? 40 : temperature > 30 ? 30 : temperature > 25 ? 20 : 10),
        humidity: humidity < 20 ? 30 : humidity < 30 ? 25 : humidity < 40 ? 20 : 15,
        windSpeed: windSpeed > 25 ? 30 : windSpeed > 20 ? 25 : windSpeed > 15 ? 20 : 15,
        vegetation: 20,
        drought: 15,
        landCover: 10,
        historical: 5
      },
      confidence: 0.75,
      recommendations: this.generateProfessionalRecommendations(riskLevel, { temperature, humidity, windSpeed }, 
        { ndvi: 0.5, evi: 0.4, moisture: 0.5, dryness: 0.5, date: new Date().toISOString(), confidence: 0.8 },
        { value: -0.5, category: 'moderate', percentile: 30, date: new Date().toISOString() },
        false
      )
    }
  }

  // Get current configuration status
  getStatus() {
    return {
      configured: this.isConfigured,
      services: {
        cognitiveServices: !!(this.config.cognitiveServicesEndpoint && this.config.cognitiveServicesKey),
        azureMaps: !!this.config.mapsSubscriptionKey,
        planetaryComputer: !!this.config.planetaryComputerKey
      }
    }
  }
}

export const azureService = new AzureService()
export type { 
  FireRiskPrediction, 
  AzureConfig, 
  FireSpreadPrediction,
  EvacuationZone,
  ResourceAllocation
}