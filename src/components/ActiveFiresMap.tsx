import React, { useRef } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { MonitoringZone } from '../App'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface ActiveFiresMapProps {
  monitoringZones: MonitoringZone[]
  activeAlerts: any[]
  onAlertSelect: (alert: any) => void
}

const ActiveFiresMap: React.FC<ActiveFiresMapProps> = ({
  monitoringZones,
  activeAlerts,
  onAlertSelect
}) => {
  const mapRef = useRef<any>(null)

  // Calculate map center based on zones
  const getMapCenter = (): LatLngExpression => {
    if (monitoringZones.length === 0) return [40.4168, -3.7038]
    
    const avgLat = monitoringZones.reduce((sum, zone) => sum + zone.center.latitude, 0) / monitoringZones.length
    const avgLng = monitoringZones.reduce((sum, zone) => sum + zone.center.longitude, 0) / monitoringZones.length
    
    return [avgLat, avgLng]
  }

  const getZoneColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#65a30d'
      default: return '#6b7280'
    }
  }

  const getFireIcon = (alert: any) => {
    const magnitude = alert.analysis?.magnitudeScore || 0
    const color = magnitude >= 80 ? '#dc2626' : 
                  magnitude >= 60 ? '#ea580c' : 
                  magnitude >= 40 ? '#d97706' : '#65a30d'
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      className: 'custom-fire-icon'
    })
  }

  return (
    <div style={{ height: '500px', width: '100%' }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={getMapCenter()}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Monitoring Zones */}
        {monitoringZones.map((zone) => {
          const coordinates: LatLngExpression[] = zone.polygon.map(point => [point.latitude, point.longitude])
          
          return (
            <Polygon
              key={zone.id}
              positions={coordinates}
              pathOptions={{
                color: getZoneColor(zone.priority),
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.1
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold">{zone.name}</h3>
                  <p className="text-sm">Priority: {zone.priority}</p>
                  <p className="text-sm">Area: {zone.area.toFixed(2)} km²</p>
                </div>
              </Popup>
            </Polygon>
          )
        })}

        {/* Active Fire Alerts */}
        {activeAlerts.map((alert) => (
          <Marker
            key={alert.id}
            position={[alert.fireData.location.latitude, alert.fireData.location.longitude]}
            icon={getFireIcon(alert)}
            eventHandlers={{
              click: () => onAlertSelect(alert)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-red-600 mb-2">🔥 Active Fire</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Zone:</strong> {alert.zone.name}</div>
                  <div><strong>Detection:</strong> {new Date(alert.fireData.detectionTime).toLocaleTimeString()}</div>
                  <div><strong>Satellite:</strong> {alert.fireData.satellite}</div>
                  <div><strong>Confidence:</strong> {alert.fireData.confidence}%</div>
                  <div><strong>Brightness:</strong> {alert.fireData.brightness}K</div>
                  <div><strong>Size:</strong> {alert.fireData.size.toFixed(1)} ha</div>
                  
                  {alert.status === 'ready' && (
                    <>
                      <hr className="my-2" />
                      <div><strong>Magnitude:</strong> {alert.analysis.magnitudeScore}/100</div>
                      <div><strong>Danger:</strong> {alert.analysis.dangerScore}/100</div>
                      <div><strong>Spread:</strong> {alert.analysis.spreadPrediction.speed.toFixed(1)} km/h</div>
                    </>
                  )}
                  
                  {alert.status === 'analyzing' && (
                    <div className="text-yellow-600 font-medium">
                      🤖 Analyzing with Azure AI...
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-red-600 bg-red-600 bg-opacity-20"></div>
            <span>Critical Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-orange-600 bg-orange-600 bg-opacity-20"></div>
            <span>High Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-yellow-600 bg-yellow-600 bg-opacity-20"></div>
            <span>Medium Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-green-600 bg-green-600 bg-opacity-20"></div>
            <span>Low Zone</span>
          </div>
          <hr className="my-2" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Active Fire</span>
          </div>
        </div>
      </div>

      {/* Satellite Data Info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">🛰️ Satellite Data</h4>
        <div className="space-y-1 text-xs">
          <div><strong>VIIRS:</strong> Night detection</div>
          <div><strong>MODIS:</strong> Thermal monitoring</div>
          <div><strong>Sentinel-2:</strong> Optical analysis</div>
          <div><strong>Landsat:</strong> Vegetation indices</div>
        </div>
      </div>
    </div>
  )
}

export default ActiveFiresMap