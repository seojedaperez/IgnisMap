// Configuration for Real Data Sources
// Centralized configuration for all external APIs

export const DATA_SOURCES_CONFIG = {
  // FREE APIs (No API key required)
  FREE_APIS: {
    openMeteo: {
      baseUrl: 'https://api.open-meteo.com/v1/forecast',
      description: 'Weather data - Already implemented ✅',
      status: 'active'
    },
    gbif: {
      baseUrl: 'https://api.gbif.org/v1',
      description: 'Global biodiversity data',
      status: 'ready_to_implement'
    },
    openStreetMap: {
      baseUrl: 'https://overpass-api.de/api/interpreter',
      description: 'Infrastructure and geographic data',
      status: 'ready_to_implement'
    },
    usgsModis: {
      baseUrl: 'https://modis.ornl.gov/rst/api/v1',
      description: 'Vegetation indices (NDVI, EVI)',
      status: 'ready_to_implement'
    },
    noaaWeather: {
      baseUrl: 'https://api.weather.gov',
      description: 'Advanced weather data (US focused)',
      status: 'optional'
    },
    copernicusClimate: {
      baseUrl: 'https://cds.climate.copernicus.eu/api/v2',
      description: 'Climate and drought data',
      status: 'ready_to_implement'
    }
  },

  // APIs WITH FREE TIERS (API key required but free tier available)
  FREE_TIER_APIS: {
    nasaFirms: {
      baseUrl: 'https://firms.modaps.eosdis.nasa.gov/api',
      description: 'Real-time active fires',
      freeLimit: 'Unlimited',
      registrationUrl: 'https://firms.modaps.eosdis.nasa.gov/api/area/',
      status: 'high_priority'
    },
    iucnRedList: {
      baseUrl: 'https://apiv3.iucnredlist.org/api/v3',
      description: 'Species conservation status',
      freeLimit: '10,000 requests/month',
      registrationUrl: 'https://apiv3.iucnredlist.org/api/v3/token',
      status: 'high_priority'
    },
    hereMaps: {
      baseUrl: 'https://developer.here.com/documentation',
      description: 'Advanced mapping and routing',
      freeLimit: '250,000 requests/month',
      registrationUrl: 'https://developer.here.com/sign-up',
      status: 'medium_priority'
    },
    windyApi: {
      baseUrl: 'https://api.windy.com',
      description: 'Professional weather and wind data',
      freeLimit: '1,000 requests/day',
      registrationUrl: 'https://api.windy.com/keys',
      status: 'medium_priority'
    },
    planetaryComputer: {
      baseUrl: 'https://planetarycomputer.microsoft.com/api/stac/v1',
      description: 'Satellite imagery - Partially implemented ✅',
      freeLimit: 'Generous free tier',
      registrationUrl: 'https://planetarycomputer.microsoft.com/account/request',
      status: 'active'
    }
  },

  // PREMIUM APIs (Paid, but with free credits)
  PREMIUM_APIS: {
    googleMaps: {
      baseUrl: 'https://maps.googleapis.com/maps/api',
      description: 'Comprehensive mapping and places data',
      freeCredit: '$200/month',
      registrationUrl: 'https://console.cloud.google.com/google/maps-apis',
      status: 'optional'
    },
    ecmwf: {
      baseUrl: 'https://www.ecmwf.int/en/forecasts/datasets',
      description: 'Professional weather models',
      cost: '€50-200/month',
      registrationUrl: 'https://www.ecmwf.int/en/forecasts/datasets',
      status: 'advanced_feature'
    }
  }
}

// Priority implementation order
export const IMPLEMENTATION_PRIORITY = [
  {
    phase: 1,
    title: 'Critical Real Data (Week 1)',
    apis: [
      'nasaFirms',      // Real active fires
      'gbif',           // Real species data
      'openStreetMap',  // Real infrastructure
      'usgsModis'       // Real vegetation indices
    ],
    impact: 'High - Eliminates most simulated data',
    effort: 'Medium'
  },
  {
    phase: 2,
    title: 'Enhanced Data (Week 2)',
    apis: [
      'iucnRedList',    // Official conservation status
      'copernicusClimate', // Real drought data
      'hereMaps',       // Advanced routing
      'windyApi'        // Professional wind data
    ],
    impact: 'Medium - Improves data quality',
    effort: 'Medium'
  },
  {
    phase: 3,
    title: 'Premium Features (Week 3)',
    apis: [
      'googleMaps',     // Comprehensive places
      'ecmwf',          // Professional weather models
      'noaaWeather'     // Advanced weather
    ],
    impact: 'Low - Nice to have features',
    effort: 'High'
  }
]

// Files that need modification to use real data
export const FILES_TO_MODIFY = {
  HIGH_PRIORITY: [
    {
      file: 'src/services/windAnalysisService.ts',
      currentStatus: '100% simulated',
      realDataSource: 'windyApi + openMeteo',
      effort: 'Medium'
    },
    {
      file: 'src/services/biodiversityAssessmentService.ts',
      currentStatus: '100% simulated',
      realDataSource: 'gbif + iucnRedList + openStreetMap',
      effort: 'High'
    },
    {
      file: 'src/contexts/AlertContext.tsx',
      currentStatus: '100% simulated',
      realDataSource: 'nasaFirms + weatherService',
      effort: 'Low'
    }
  ],
  MEDIUM_PRIORITY: [
    {
      file: 'src/services/tacticalFirefightingService.ts',
      currentStatus: '100% simulated',
      realDataSource: 'openStreetMap + hereMaps',
      effort: 'High'
    },
    {
      file: 'src/services/planetaryComputerService.ts',
      currentStatus: '50% real, 50% simulated',
      realDataSource: 'planetaryComputer + usgsModis',
      effort: 'Medium'
    }
  ]
}

// API Keys needed for full implementation
export const REQUIRED_API_KEYS = {
  IMMEDIATE: [
    'NASA_FIRMS_API_KEY',
    'IUCN_API_KEY'
  ],
  OPTIONAL: [
    'WINDY_API_KEY',
    'HERE_API_KEY',
    'GOOGLE_MAPS_API_KEY',
    'ECMWF_API_KEY'
  ]
}