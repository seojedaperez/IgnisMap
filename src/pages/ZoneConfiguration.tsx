import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { Map as LeafletMap } from 'leaflet'
import { Save, MapPin, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { OrganizationConfig, MonitoringZone } from '../App'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

interface ZoneConfigurationProps {
  organization: OrganizationConfig
  onZonesConfigured: (zones: MonitoringZone[]) => void
}

const ZoneConfiguration: React.FC<ZoneConfigurationProps> = ({ 
  organization, 
  onZonesConfigured 
}) => {
  const [zones, setZones] = useState<MonitoringZone[]>([])
  const [currentZoneName, setCurrentZoneName] = useState('')
  const [currentZonePriority, setCurrentZonePriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium')
  const [isDrawing, setIsDrawing] = useState(false)
  const mapRef = useRef<LeafletMap>(null)

  const handleZoneCreated = (e: any) => {
    const layer = e.layer
    const coordinates = layer.getLatLngs()[0].map((latlng: any) => ({
      latitude: latlng.lat,
      longitude: latlng.lng
    }))

    if (!currentZoneName.trim()) {
      alert('Please enter a name for the zone before drawing it')
      return
    }

    // Calculate center point
    const latSum = coordinates.reduce((sum: number, coord: any) => sum + coord.latitude, 0)
    const lngSum = coordinates.reduce((sum: number, coord: any) => sum + coord.longitude, 0)
    const center = {
      latitude: latSum / coordinates.length,
      longitude: lngSum / coordinates.length
    }

    // Calculate approximate area (simplified)
    const area = calculatePolygonArea(coordinates)

    const newZone: MonitoringZone = {
      id: `zone_${Date.now()}`,
      name: currentZoneName,
      polygon: coordinates,
      center,
      area,
      priority: currentZonePriority,
      createdAt: new Date().toISOString()
    }

    setZones([...zones, newZone])
    setCurrentZoneName('')
    setIsDrawing(false)
  }

  const calculatePolygonArea = (coordinates: Array<{ latitude: number, longitude: number }>): number => {
    // Simplified area calculation in km²
    if (coordinates.length < 3) return 0
    
    let area = 0
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length
      area += coordinates[i].latitude * coordinates[j].longitude
      area -= coordinates[j].latitude * coordinates[i].longitude
    }
    area = Math.abs(area) / 2
    
    // Convert to km² (very rough approximation)
    return area * 111 * 111
  }

  const removeZone = (zoneId: string) => {
    setZones(zones.filter(zone => zone.id !== zoneId))
  }

  const handleContinue = () => {
    if (zones.length === 0) {
      alert('You must configure at least one monitoring zone')
      return
    }
    onZonesConfigured(zones)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleAddZone = () => {
    if (!currentZoneName.trim()) {
      alert('Please enter a name for the zone before drawing it')
      return
    }
    setIsDrawing(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                Monitoring Zones Configuration
              </h1>
              <p className="text-xs md:text-base text-gray-600">
                {organization.name} - {organization.type}
              </p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
              <span className="text-xs md:text-sm text-gray-500">
                Zones: {zones.length}
              </span>
              <button
                onClick={handleContinue}
                disabled={zones.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-1.5 md:px-6 md:py-2 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2"
              >
                <Save className="h-3 w-3 md:h-4 md:w-4" />
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Configuration Map
              </h2>
              
              {/* Zone Creation Form */}
              <div className="mb-3 md:mb-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2 md:mb-3 text-sm md:text-base">Create New Zone</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
                  <input
                    type="text"
                    value={currentZoneName}
                    onChange={(e) => setCurrentZoneName(e.target.value)}
                    placeholder="Zone name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <select
                    value={currentZonePriority}
                    onChange={(e) => setCurrentZonePriority(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical Priority</option>
                  </select>
                  <button
                    onClick={handleAddZone}
                    disabled={!currentZoneName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 md:gap-2"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    Draw Zone
                  </button>
                </div>
                <p className="text-xs md:text-sm text-blue-700 mt-2">
                  1. Enter the zone name and priority<br />
                  2. Click "Draw Zone"<br />
                  3. Draw the polygon on the map<br />
                  4. You can add multiple monitoring zones
                </p>
              </div>

              <div style={{ height: '400px', maxHeight: 'calc(100vh - 300px)' }} className="rounded-lg overflow-hidden">
                <MapContainer
                  center={[40.4168, -3.7038]}
                  zoom={10}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FeatureGroup>
                    <EditControl
                      position="topright"
                      onCreated={handleZoneCreated}
                      draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: isDrawing ? {
                          allowIntersection: false,
                          drawError: {
                            color: '#e1e100',
                            message: '<strong>Error:</strong> Lines cannot cross!'
                          },
                          shapeOptions: {
                            color: '#ff0000',
                            weight: 3,
                            opacity: 0.8,
                            fillOpacity: 0.2
                          }
                        } : false
                      }}
                      edit={{
                        edit: false,
                        remove: false
                      }}
                    />
                  </FeatureGroup>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Zones List */}
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Configured Zones
              </h2>

              {zones.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <MapPin className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">No zones configured</p>
                  <p className="text-xs md:text-sm text-gray-400">
                    Draw polygons on the map to create monitoring zones
                  </p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {zones.map((zone) => (
                    <div key={zone.id} className="p-2 md:p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-1 md:mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{zone.name}</h3>
                        <button
                          onClick={() => removeZone(zone.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-1 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(zone.priority)}`}>
                            {zone.priority.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-medium">{zone.area.toFixed(2)} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Points:</span>
                          <span className="font-medium">{zone.polygon.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3 md:p-4">
              <div className="flex items-start gap-2 md:gap-3">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1 md:mb-2 text-sm md:text-base">Instructions</h3>
                  <ul className="text-xs md:text-sm text-yellow-700 space-y-1">
                    <li>• Draw polygons to define monitoring areas</li>
                    <li>• You can create multiple zones with different priorities</li>
                    <li>• Each zone will receive specific fire alerts</li>
                    <li>• Priority determines alert urgency</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Azure Services Info */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 md:p-4">
              <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">🛰️ Satellite Data</h3>
              <div className="text-xs md:text-sm text-blue-700 space-y-1">
                <div>• <strong>Sentinel-2:</strong> Active fire detection</div>
                <div>• <strong>MODIS:</strong> Real-time thermal monitoring</div>
                <div>• <strong>Landsat:</strong> Vegetation analysis (NDVI)</div>
                <div>• <strong>VIIRS:</strong> Nighttime fire detection</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoneConfiguration