import React, { useEffect, useRef, useState } from 'react'
import { azureConfig } from '../services/azureConfigLoader'

// Alternative import for Azure Maps
declare global {
  interface Window {
    atlas: any
  }
}

export interface AzureMapComponentProps {
  center: [number, number] // [longitude, latitude] - Azure Maps format
  zoom?: number
  height?: string
  className?: string
  onMapReady?: (map: any) => void
  fireRiskZones?: Array<{
    id: string
    name: string
    position: [number, number] // [longitude, latitude]
    riskLevel: 'low' | 'medium' | 'high' | 'extreme'
    temperature: number
    humidity: number
    windSpeed: number
    lastUpdate: string
  }>
  evacuationRoutes?: Array<{
    id: string
    coordinates: Array<[number, number]>
    priority: 'immediate' | 'high' | 'medium' | 'low'
  }>
  emergencyFacilities?: Array<{
    id: string
    name: string
    type: 'hospital' | 'fire_station' | 'police' | 'shelter'
    position: [number, number]
    status: 'operational' | 'at_capacity' | 'evacuated'
  }>
}

const AzureMapComponent: React.FC<AzureMapComponentProps> = ({
  center,
  zoom = 10,
  height = '600px',
  className = '',
  onMapReady,
  fireRiskZones = [],
  evacuationRoutes = [],
  emergencyFacilities = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [atlasLoaded, setAtlasLoaded] = useState(false)

  useEffect(() => {
    if (mapRef.current && atlasLoaded && !map) {
      // Get Azure Maps key from config loader
      const subscriptionKey = azureConfig.getAzureMapsKey()
      
      if (!subscriptionKey) {
        console.error('Azure Maps subscription key not found. Please check your .env file.')
        return
      }

      // Initialize Azure Maps
      const azureMap = new window.atlas.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        language: 'en-US',
        view: 'Auto',
        authOptions: {
          authType: 'subscriptionKey',
          subscriptionKey: subscriptionKey
        },
        style: 'satellite_road_labels', // Professional satellite view with labels
        showLogo: false,
        showFeedbackLink: false
      })

      azureMap.events.add('ready', () => {
        console.log('Azure Maps loaded successfully')
        setMap(azureMap)
        setIsLoaded(true)
      })
    }
  }, [mapRef, map, atlasLoaded, center, zoom])

  // Add data sources and layers when map is ready
  useEffect(() => {
    if (map && isLoaded) {
      // Create data sources
      const zonesDataSource = new window.atlas.source.DataSource('fireRiskZones')
      const routesDataSource = new window.atlas.source.DataSource('evacuationRoutes')
      const facilitiesDataSource = new window.atlas.source.DataSource('emergencyFacilities')
      
      map.sources.add(zonesDataSource)
      map.sources.add(routesDataSource)
      map.sources.add(facilitiesDataSource)

      // Add fire risk zones
      fireRiskZones.forEach(zone => {
        const point = new window.atlas.data.Point(zone.position)
        
        zonesDataSource.add(new window.atlas.data.Feature(point, {
          id: zone.id,
          name: zone.name,
          riskLevel: zone.riskLevel,
          temperature: zone.temperature,
          humidity: zone.humidity,
          windSpeed: zone.windSpeed,
          lastUpdate: zone.lastUpdate
        }))
      })

      // Add evacuation routes
      evacuationRoutes.forEach(route => {
        const line = new window.atlas.data.LineString(route.coordinates)
        
        routesDataSource.add(new window.atlas.data.Feature(line, {
          id: route.id,
          priority: route.priority
        }))
      })

      // Add emergency facilities
      emergencyFacilities.forEach(facility => {
        const point = new window.atlas.data.Point(facility.position)
        
        facilitiesDataSource.add(new window.atlas.data.Feature(point, {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          status: facility.status
        }))
      })

      // Add fire risk zones layer
      map.layers.add(new window.atlas.layer.BubbleLayer(zonesDataSource, 'fireRiskBubbles', {
        radius: [
          'case',
          ['==', ['get', 'riskLevel'], 'extreme'], 25,
          ['==', ['get', 'riskLevel'], 'high'], 20,
          ['==', ['get', 'riskLevel'], 'medium'], 15,
          10
        ],
        color: [
          'case',
          ['==', ['get', 'riskLevel'], 'extreme'], '#dc2626',
          ['==', ['get', 'riskLevel'], 'high'], '#ea580c',
          ['==', ['get', 'riskLevel'], 'medium'], '#d97706',
          '#65a30d'
        ],
        opacity: 0.7,
        strokeColor: 'white',
        strokeWidth: 2
      }))

      // Add evacuation routes layer
      map.layers.add(new window.atlas.layer.LineLayer(routesDataSource, 'evacuationLines', {
        strokeColor: [
          'case',
          ['==', ['get', 'priority'], 'immediate'], '#dc2626',
          ['==', ['get', 'priority'], 'high'], '#ea580c',
          ['==', ['get', 'priority'], 'medium'], '#d97706',
          '#65a30d'
        ],
        strokeWidth: [
          'case',
          ['==', ['get', 'priority'], 'immediate'], 6,
          ['==', ['get', 'priority'], 'high'], 4,
          3
        ],
        strokeDashArray: [
          'case',
          ['==', ['get', 'priority'], 'immediate'], ['literal', [1, 0]],
          ['literal', [5, 5]]
        ]
      }))

      // Add emergency facilities layer with custom icons
      map.layers.add(new window.atlas.layer.SymbolLayer(facilitiesDataSource, 'facilitiesSymbols', {
        iconOptions: {
          image: [
            'case',
            ['==', ['get', 'type'], 'hospital'], 'pin-red',
            ['==', ['get', 'type'], 'fire_station'], 'pin-blue',
            ['==', ['get', 'type'], 'police'], 'pin-purple',
            'pin-green'
          ],
          size: 1.2,
          allowOverlap: true
        },
        textOptions: {
          textField: ['get', 'name'],
          offset: [0, 2],
          size: 12,
          color: 'white',
          haloColor: 'black',
          haloWidth: 1
        }
      }))

      // Add popups
      const zonePopup = new window.atlas.Popup({
        pixelOffset: [0, -5],
        closeButton: false
      })

      const facilityPopup = new window.atlas.Popup({
        pixelOffset: [0, -5],
        closeButton: false
      })

      // Add click events for zones
      map.events.add('click', 'fireRiskBubbles', (e: any) => {
        if (e.shapes && e.shapes.length > 0) {
          const properties = e.shapes[0].getProperties()
          
          const content = `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 16px; font-weight: bold;">
                ${properties.name}
              </h3>
              <div style="margin-bottom: 8px;">
                <strong>Risk Level:</strong> 
                <span style="color: ${getRiskColor(properties.riskLevel)}; font-weight: bold; text-transform: uppercase;">
                  ${properties.riskLevel}
                </span>
              </div>
              <div style="margin-bottom: 5px;"><strong>Temperature:</strong> ${properties.temperature}°C</div>
              <div style="margin-bottom: 5px;"><strong>Humidity:</strong> ${properties.humidity}%</div>
              <div style="margin-bottom: 5px;"><strong>Wind:</strong> ${properties.windSpeed} km/h</div>
              <div style="font-size: 11px; color: #666; margin-top: 8px;">
                Last update: ${new Date(properties.lastUpdate).toLocaleString('en-US')}
              </div>
            </div>
          `
          
          zonePopup.setOptions({
            content: content,
            position: e.position
          })
          
          zonePopup.open(map)
        }
      })

      // Add click events for facilities
      map.events.add('click', 'facilitiesSymbols', (e: any) => {
        if (e.shapes && e.shapes.length > 0) {
          const properties = e.shapes[0].getProperties()
          
          const content = `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
                ${properties.name}
              </h3>
              <div style="margin-bottom: 8px;">
                <strong>Type:</strong> ${getFacilityTypeLabel(properties.type)}
              </div>
              <div style="margin-bottom: 5px;">
                <strong>Status:</strong> 
                <span style="color: ${getStatusColor(properties.status)}; font-weight: bold;">
                  ${getFacilityStatusLabel(properties.status)}
                </span>
              </div>
            </div>
          `

          facilityPopup.setOptions({
            content: content,
            position: e.position
          })
          
          facilityPopup.open(map)
        }
      })

      // Close popups when clicking elsewhere
      map.events.add('click', (e: any) => {
        if (!e.shapes || e.shapes.length === 0) {
          zonePopup.close()
          facilityPopup.close()
        }
      })

      // Call onMapReady callback if provided
      if (onMapReady) {
        onMapReady(map)
      }

      return () => {
        // Clean up
        if (map) {
          map.sources.remove('fireRiskZones')
          map.sources.remove('evacuationRoutes')
          map.sources.remove('emergencyFacilities')
        }
      }
    }
  }, [map, isLoaded, fireRiskZones, evacuationRoutes, emergencyFacilities, onMapReady])

  // Load Azure Maps SDK
  useEffect(() => {
    const loadAzureMaps = () => {
      if (window.atlas) {
        setAtlasLoaded(true)
        return
      }

      // Check if scripts are already loaded to prevent duplicates
      const existingScript = document.querySelector('script[src*="atlas.min.js"]')
      const existingCSS = document.querySelector('link[href*="atlas.min.css"]')

      if (!existingCSS) {
        // Load CSS
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css'
        document.head.appendChild(cssLink)
      }

      if (!existingScript) {
        // Load JavaScript
        const script = document.createElement('script')
        script.src = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js'
        script.async = true
        script.onload = () => setAtlasLoaded(true)
        document.head.appendChild(script)
      } else if (window.atlas) {
        setAtlasLoaded(true)
      }
    }

    loadAzureMaps()
  }, [])

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'extreme': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#65a30d'
      default: return '#6b7280'
    }
  }

  const getFacilityTypeLabel = (type: string): string => {
    switch (type) {
      case 'hospital': return 'Hospital'
      case 'fire_station': return 'Fire Station'
      case 'police': return 'Police Station'
      case 'shelter': return 'Shelter'
      default: return type
    }
  }

  const getFacilityStatusLabel = (status: string): string => {
    switch (status) {
      case 'operational': return 'Operational'
      case 'at_capacity': return 'At Capacity'
      case 'evacuated': return 'Evacuated'
      default: return status
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'operational': return '#10b981'
      case 'at_capacity': return '#f59e0b'
      case 'evacuated': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden"
      />
      
      {/* Azure Maps Attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600">
        Powered by Microsoft Azure Maps
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg max-w-xs">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="font-medium text-gray-800 mb-1">Risk Level:</div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Extreme</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Low</span>
          </div>
          
          <div className="border-t pt-2 mt-2">
            <div className="font-medium text-gray-800 mb-1">Facilities:</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span>Hospital</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>Fire Station</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <span>Police</span>
            </div>
          </div>

          <div className="border-t pt-2 mt-2">
            <div className="font-medium text-gray-800 mb-1">Evacuation Routes:</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-red-600"></div>
              <span>Immediate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-orange-600"></div>
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-yellow-600 border-dashed border-t"></div>
              <span>Medium</span>
            </div>
          </div>
        </div>
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="loading-spinner mb-2"></div>
            <p className="text-sm text-gray-600">
              {!atlasLoaded ? 'Loading Azure Maps SDK...' : 'Initializing map...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AzureMapComponent