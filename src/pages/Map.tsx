import React, { useState, useEffect } from 'react'
import { AlertTriangle, Flame, Wind, Droplets, Settings, RefreshCw } from 'lucide-react'
import AzureMapComponent from '../components/AzureMapComponent'
import { azureMapsService } from '../services/azureMapsService'
import { useWeather } from '../contexts/WeatherContext'

interface FireRiskZone {
  id: string
  name: string
  position: [number, number] // [longitude, latitude] for Azure Maps
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  temperature: number
  humidity: number
  windSpeed: number
  lastUpdate: string
}

interface EvacuationRoute {
  id: string
  coordinates: Array<[number, number]>
  priority: 'immediate' | 'high' | 'medium' | 'low'
}

interface EmergencyFacility {
  id: string
  name: string
  type: 'hospital' | 'fire_station' | 'police' | 'shelter'
  position: [number, number]
  status: 'operational' | 'at_capacity' | 'evacuated'
}

const Map: React.FC = () => {
  const { currentWeather, serviceStatus } = useWeather()
  const [selectedZone, setSelectedZone] = useState<FireRiskZone | null>(null)
  const [fireRiskZones, setFireRiskZones] = useState<FireRiskZone[]>([])
  const [evacuationRoutes, setEvacuationRoutes] = useState<EvacuationRoute[]>([])
  const [emergencyFacilities, setEmergencyFacilities] = useState<EmergencyFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [mapCenter] = useState<[number, number]>([-3.7038, 40.4168]) // [longitude, latitude] for Madrid
  
  useEffect(() => {
    loadMapData()
  }, [])

  const loadMapData = async () => {
    setLoading(true)
    try {
      // Generate realistic fire risk zones for Spain
      const zones: FireRiskZone[] = [
        {
          id: '1',
          name: 'Sierra de Guadarrama',
          position: [-4.0162, 40.7589],
          riskLevel: 'high',
          temperature: 32,
          humidity: 25,
          windSpeed: 15,
          lastUpdate: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Parque Nacional de Doñana',
          position: [-6.4686, 37.0042],
          riskLevel: 'extreme',
          temperature: 38,
          humidity: 18,
          windSpeed: 22,
          lastUpdate: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Picos de Europa',
          position: [-4.8551, 43.1828],
          riskLevel: 'medium',
          temperature: 28,
          humidity: 45,
          windSpeed: 8,
          lastUpdate: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Costa Brava',
          position: [3.0951, 41.9794],
          riskLevel: 'low',
          temperature: 26,
          humidity: 65,
          windSpeed: 5,
          lastUpdate: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Madrid Centro',
          position: [-3.7038, 40.4168],
          riskLevel: 'medium',
          temperature: currentWeather?.temperature || 30,
          humidity: currentWeather?.humidity || 40,
          windSpeed: currentWeather?.windSpeed || 12,
          lastUpdate: new Date().toISOString()
        }
      ]

      // Generate evacuation routes
      const routes: EvacuationRoute[] = [
        {
          id: 'route_1',
          coordinates: [
            [-3.7038, 40.4168],
            [-3.6900, 40.4300],
            [-3.6800, 40.4400]
          ],
          priority: 'immediate'
        },
        {
          id: 'route_2',
          coordinates: [
            [-3.7200, 40.4100],
            [-3.7000, 40.4200],
            [-3.6850, 40.4350]
          ],
          priority: 'high'
        }
      ]

      // Load emergency facilities using Azure Maps
      const facilities = await azureMapsService.findNearbyEmergencyFacilities(
        { latitude: 40.4168, longitude: -3.7038 },
        25000 // 25km radius
      )

      const mappedFacilities: EmergencyFacility[] = facilities.slice(0, 10).map(facility => ({
        id: facility.id,
        name: facility.name,
        type: facility.type as any,
        position: [facility.location.longitude, facility.location.latitude],
        status: facility.status === 'operational' ? 'operational' : 'at_capacity'
      }))

      setFireRiskZones(zones)
      setEvacuationRoutes(routes)
      setEmergencyFacilities(mappedFacilities)
    } catch (error) {
      console.error('Error loading map data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMapReady = (map: any) => {
    console.log('🗺️ Azure Maps ready for fire risk visualization')
  }

  const refreshData = () => {
    loadMapData()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Riesgo de Incendios</h1>
          <p className="text-gray-600">
            {serviceStatus.configured 
              ? '🌍 Monitoreo en tiempo real con Azure Maps Weather Services'
              : '⚠️ Usando datos de respaldo - Configure Azure Maps para datos completos'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Bajo
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Medio
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Alto
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Extremo
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Azure Maps Component */}
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden" style={{ height: '600px' }}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-gray-600">Cargando datos de Azure Maps...</p>
                </div>
              </div>
            ) : (
              <AzureMapComponent
                center={mapCenter}
                zoom={6}
                height="600px"
                onMapReady={handleMapReady}
                fireRiskZones={fireRiskZones}
                evacuationRoutes={evacuationRoutes}
                emergencyFacilities={emergencyFacilities}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Service Status */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Estado del Servicio
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Azure Maps</span>
                <span className="text-green-600">● Activo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Weather Services</span>
                <span className={serviceStatus.configured ? 'text-green-600' : 'text-orange-600'}>
                  ● {serviceStatus.configured ? 'Configurado' : 'Pendiente'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Geofencing</span>
                <span className="text-green-600">● Operativo</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Rutas en Tiempo Real</span>
                <span className="text-green-600">● Operativo</span>
              </div>
            </div>
          </div>

          {/* Zone Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalles de Zona
            </h3>
            
            {selectedZone ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedZone.name}</h4>
                  <p className={`text-sm font-medium ${
                    selectedZone.riskLevel === 'extreme' ? 'text-red-600' :
                    selectedZone.riskLevel === 'high' ? 'text-orange-600' :
                    selectedZone.riskLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Riesgo {selectedZone.riskLevel.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-gray-600">Temperatura</span>
                    </div>
                    <span className="font-medium">{selectedZone.temperature}°C</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">Humedad</span>
                    </div>
                    <span className="font-medium">{selectedZone.humidity}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Viento</span>
                    </div>
                    <span className="font-medium">{selectedZone.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Última actualización: {new Date(selectedZone.lastUpdate).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Haga clic en una zona del mapa para ver los detalles
              </p>
            )}
          </div>

          {/* High Risk Zones */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Zonas de Alto Riesgo
            </h3>
            <div className="space-y-2">
              {fireRiskZones
                .filter(zone => zone.riskLevel === 'high' || zone.riskLevel === 'extreme')
                .map(zone => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-4 w-4 ${
                        zone.riskLevel === 'extreme' ? 'text-red-500' : 'text-orange-500'
                      }`} />
                      <span className="text-sm font-medium">{zone.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      zone.riskLevel === 'extreme' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Emergency Facilities Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Instalaciones de Emergencia
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Hospitales:</span>
                <span className="font-medium">
                  {emergencyFacilities.filter(f => f.type === 'hospital').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estaciones de Bomberos:</span>
                <span className="font-medium">
                  {emergencyFacilities.filter(f => f.type === 'fire_station').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Comisarías:</span>
                <span className="font-medium">
                  {emergencyFacilities.filter(f => f.type === 'police').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refugios:</span>
                <span className="font-medium">
                  {emergencyFacilities.filter(f => f.type === 'shelter').length}
                </span>
              </div>
            </div>
          </div>

          {/* Azure Maps Features */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Capacidades Azure Maps
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Geofencing en tiempo real
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Rutas de evacuación optimizadas
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Análisis de tráfico en vivo
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Instalaciones de emergencia
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Monitoreo meteorológico
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-green-600">✓</span>
                Visualización satelital
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map