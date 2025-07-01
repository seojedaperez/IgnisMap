// Real Data Integration Service
// Integrates multiple real APIs for professional wildfire management

interface RealDataConfig {
  nasaFirmsApiKey?: string
  gbifApiKey?: string
  iucnApiKey?: string
  hereApiKey?: string
  windyApiKey?: string
  ecmwfApiKey?: string
}

class RealDataIntegrationService {
  private config: RealDataConfig = {}

  configure(config: RealDataConfig) {
    this.config = config
  }

  // NASA FIRMS - Real active fires
  async getActiveFires(bbox: number[]): Promise<Array<{
    latitude: number
    longitude: number
    brightness: number
    confidence: number
    acq_date: string
    acq_time: string
    satellite: string
    instrument: string
    version: string
  }>> {
    try {
      const [minLon, minLat, maxLon, maxLat] = bbox
      const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${this.config.nasaFirmsApiKey}/VIIRS_SNPP_NRT/${minLon},${minLat},${maxLon},${maxLat}/1`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`NASA FIRMS API error: ${response.status}`)
      
      const csvText = await response.text()
      return this.parseFiresCSV(csvText)
    } catch (error) {
      console.error('Error fetching real fire data:', error)
      return []
    }
  }

  // GBIF - Real species data
  async getSpeciesInArea(bbox: number[]): Promise<Array<{
    scientificName: string
    vernacularName: string
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
    species: string
    decimalLatitude: number
    decimalLongitude: number
    occurrenceStatus: string
    establishmentMeans: string
    lastInterpreted: string
  }>> {
    try {
      const [minLon, minLat, maxLon, maxLat] = bbox
      const url = `https://api.gbif.org/v1/occurrence/search?decimalLatitude=${minLat},${maxLat}&decimalLongitude=${minLon},${maxLon}&limit=300&hasCoordinate=true&hasGeospatialIssue=false`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`GBIF API error: ${response.status}`)
      
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('Error fetching real species data:', error)
      return []
    }
  }

  // IUCN Red List - Real conservation status
  async getConservationStatus(speciesName: string): Promise<{
    taxonid: number
    scientific_name: string
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
    main_common_name: string
    authority: string
    published_year: number
    assessment_date: string
    category: string
    criteria: string
    population_trend: string
    marine_system: boolean
    freshwater_system: boolean
    terrestrial_system: boolean
  } | null> {
    try {
      const url = `https://apiv3.iucnredlist.org/api/v3/species/${encodeURIComponent(speciesName)}?token=${this.config.iucnApiKey}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`IUCN API error: ${response.status}`)
      
      const data = await response.json()
      return data.result?.[0] || null
    } catch (error) {
      console.error('Error fetching conservation status:', error)
      return null
    }
  }

  // OpenStreetMap Overpass - Real infrastructure
  async getInfrastructure(bbox: number[]): Promise<{
    hospitals: any[]
    schools: any[]
    fireStations: any[]
    powerPlants: any[]
    waterSources: any[]
    roads: any[]
    buildings: any[]
  }> {
    try {
      const [minLon, minLat, maxLon, maxLat] = bbox
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](${minLat},${minLon},${maxLat},${maxLon});
          node["amenity"="school"](${minLat},${minLon},${maxLat},${maxLon});
          node["amenity"="fire_station"](${minLat},${minLon},${maxLat},${maxLon});
          node["power"="plant"](${minLat},${minLon},${maxLat},${maxLon});
          node["natural"="water"](${minLat},${minLon},${maxLat},${maxLon});
          way["highway"](${minLat},${minLon},${maxLat},${maxLon});
          way["building"](${minLat},${minLon},${maxLat},${maxLon});
        );
        out geom;
      `
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      })
      
      if (!response.ok) throw new Error(`Overpass API error: ${response.status}`)
      
      const data = await response.json()
      return this.categorizeInfrastructure(data.elements)
    } catch (error) {
      console.error('Error fetching real infrastructure data:', error)
      return {
        hospitals: [],
        schools: [],
        fireStations: [],
        powerPlants: [],
        waterSources: [],
        roads: [],
        buildings: []
      }
    }
  }

  // USGS MODIS - Real vegetation indices
  async getVegetationIndices(latitude: number, longitude: number): Promise<{
    ndvi: number
    evi: number
    date: string
    quality: string
  } | null> {
    try {
      const url = `https://modis.ornl.gov/rst/api/v1/MOD13Q1/subset?latitude=${latitude}&longitude=${longitude}&product=MOD13Q1&band=250m_16_days_NDVI,250m_16_days_EVI&startDate=A2023001&endDate=A2023365&kmAboveBelow=0&kmLeftRight=0`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error(`MODIS API error: ${response.status}`)
      
      const data = await response.json()
      return this.parseVegetationData(data)
    } catch (error) {
      console.error('Error fetching real vegetation data:', error)
      return null
    }
  }

  // Windy API - Real wind analysis
  async getDetailedWindData(latitude: number, longitude: number): Promise<{
    wind: {
      speed: number
      direction: number
      gusts: number
    }
    forecast: Array<{
      time: string
      wind_speed: number
      wind_direction: number
      wind_gusts: number
      temperature: number
      humidity: number
    }>
  } | null> {
    try {
      const url = `https://api.windy.com/api/point-forecast/v2`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lat: latitude,
          lon: longitude,
          model: 'gfs',
          parameters: ['wind', 'windGust', 'temp', 'rh'],
          levels: ['surface'],
          key: this.config.windyApiKey
        })
      })
      
      if (!response.ok) throw new Error(`Windy API error: ${response.status}`)
      
      const data = await response.json()
      return this.parseWindData(data)
    } catch (error) {
      console.error('Error fetching real wind data:', error)
      return null
    }
  }

  // Copernicus Climate Data Store - Real drought indices
  async getDroughtIndices(bbox: number[]): Promise<{
    spei: number
    spi: number
    date: string
    severity: 'normal' | 'moderate' | 'severe' | 'extreme'
  } | null> {
    try {
      // Note: Copernicus requires more complex authentication and data processing
      // This is a simplified example - real implementation would use their Python API
      console.log('Drought data would be fetched from Copernicus CDS')
      return null
    } catch (error) {
      console.error('Error fetching real drought data:', error)
      return null
    }
  }

  // Helper methods
  private parseFiresCSV(csvText: string): any[] {
    const lines = csvText.split('\n')
    const headers = lines[0].split(',')
    const fires = []
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',')
        const fire: any = {}
        headers.forEach((header, index) => {
          fire[header.trim()] = values[index]?.trim()
        })
        fires.push(fire)
      }
    }
    
    return fires
  }

  private categorizeInfrastructure(elements: any[]): {
    hospitals: any[]
    schools: any[]
    fireStations: any[]
    powerPlants: any[]
    waterSources: any[]
    roads: any[]
    buildings: any[]
  } {
    const infrastructure: {
      hospitals: any[]
      schools: any[]
      fireStations: any[]
      powerPlants: any[]
      waterSources: any[]
      roads: any[]
      buildings: any[]
    } = {
      hospitals: [],
      schools: [],
      fireStations: [],
      powerPlants: [],
      waterSources: [],
      roads: [],
      buildings: []
    }
    
    elements.forEach((element: any) => {
      const tags = element.tags || {}
      
      if (tags.amenity === 'hospital') infrastructure.hospitals.push(element)
      else if (tags.amenity === 'school') infrastructure.schools.push(element)
      else if (tags.amenity === 'fire_station') infrastructure.fireStations.push(element)
      else if (tags.power === 'plant') infrastructure.powerPlants.push(element)
      else if (tags.natural === 'water') infrastructure.waterSources.push(element)
      else if (tags.highway) infrastructure.roads.push(element)
      else if (tags.building) infrastructure.buildings.push(element)
    })
    
    return infrastructure
  }

  private parseVegetationData(data: any): any {
    // Parse MODIS vegetation data
    if (data.subset && data.subset.length > 0) {
      const latest = data.subset[data.subset.length - 1]
      return {
        ndvi: latest.data[0] / 10000, // MODIS NDVI is scaled
        evi: latest.data[1] / 10000,  // MODIS EVI is scaled
        date: latest.calendar_date,
        quality: 'good'
      }
    }
    return null
  }

  private parseWindData(data: any): any {
    // Parse Windy API wind data
    if (data.ts && data.ts.length > 0) {
      const current = data.ts[0]
      return {
        wind: {
          speed: current['wind:surface'] || 0,
          direction: current['windDir:surface'] || 0,
          gusts: current['windGust:surface'] || 0
        },
        forecast: data.ts.map((item: any) => ({
          time: new Date(item.dt * 1000).toISOString(),
          wind_speed: item['wind:surface'] || 0,
          wind_direction: item['windDir:surface'] || 0,
          wind_gusts: item['windGust:surface'] || 0,
          temperature: item['temp:surface'] || 0,
          humidity: item['rh:surface'] || 0
        }))
      }
    }
    return null
  }

  // Integration status
  getIntegrationStatus(): {
    activeFires: boolean
    species: boolean
    conservation: boolean
    infrastructure: boolean
    vegetation: boolean
    wind: boolean
    drought: boolean
  } {
    return {
      activeFires: !!this.config.nasaFirmsApiKey,
      species: true, // GBIF is free
      conservation: !!this.config.iucnApiKey,
      infrastructure: true, // OpenStreetMap is free
      vegetation: true, // USGS is free
      wind: !!this.config.windyApiKey,
      drought: !!this.config.ecmwfApiKey
    }
  }
}

export const realDataIntegrationService = new RealDataIntegrationService()
export type { RealDataConfig }