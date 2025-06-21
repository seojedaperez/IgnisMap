import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { Users, Truck, Plane } from 'lucide-react'
import { FireSpreadPrediction, EvacuationZone, ResourceAllocation } from '../services/azureService'
import 'leaflet/dist/leaflet.css'

interface FireSpreadMapProps {
  center: LatLngExpression
  spreadPrediction?: FireSpreadPrediction
  evacuationZones?: EvacuationZone[]
  resourceAllocation?: ResourceAllocation
  className?: string
}

const FireSpreadMap: React.FC<FireSpreadMapProps> = ({
  center,
  spreadPrediction,
  evacuationZones,
  resourceAllocation,
  className = ''
}) => {
  const [selectedZone, setSelectedZone] = useState<EvacuationZone | null>(null)

  const getZoneColor = (priority: string) => {
    switch (priority) {
      case 'immediate': return '#F54768' // ember-coral
      case 'high': return '#FF9677' // ember-peach
      case 'medium': return '#f59e0b' // amarillo
      case 'low': return '#65a30d' // verde
      default: return '#6b7280' // gris
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return '#7f1d1d'
      case 'high': return '#F54768' // ember-coral
      case 'moderate': return '#FF9677' // ember-peach
      case 'low': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  // Generar rutas de evacuación que se alejen del centro del incendio
  const generateEvacuationRoute = (startPoint: LatLngExpression): LatLngExpression[] => {
    // Calcular vector desde el fuego hacia afuera
    const dx = (startPoint as [number, number])[0] - (center as [number, number])[0]
    const dy = (startPoint as [number, number])[1] - (center as [number, number])[1]
    
    // Normalizar el vector
    const length = Math.sqrt(dx * dx + dy * dy)
    const normalizedDx = dx / (length || 1)
    const normalizedDy = dy / (length || 1)
    
    // Si el punto de inicio está muy cerca del fuego, moverlo un poco hacia afuera
    const adjustedStartPoint: LatLngExpression = length < 0.01 ? 
      [(center as [number, number])[0] + normalizedDx * 0.01, (center as [number, number])[1] + normalizedDy * 0.01] : 
      startPoint
    
    // Generar punto final alejándose del fuego (distancia más larga para asegurar que salga de la zona de peligro)
    const endPoint: LatLngExpression = [
      (adjustedStartPoint as [number, number])[0] + normalizedDx * 0.05,
      (adjustedStartPoint as [number, number])[1] + normalizedDy * 0.05
    ]
    
    return [adjustedStartPoint, endPoint]
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fire spread prediction */}
        {spreadPrediction && (
          <>
            {/* 24-hour spread area */}
            <Circle
              center={center}
              radius={Math.sqrt(spreadPrediction.area24h / Math.PI) * 1000}
              fillColor="#F54768"
              fillOpacity={0.2}
              color="#F54768"
              weight={2}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-red-600">Propagación 24h</h3>
                  <p className="text-sm">Área: {spreadPrediction.area24h.toFixed(2)} hectáreas</p>
                  <p className="text-sm">Velocidad: {spreadPrediction.speed.toFixed(2)} km/h</p>
                </div>
              </Popup>
            </Circle>
            
            {/* 72-hour spread area */}
            <Circle
              center={center}
              radius={Math.sqrt(spreadPrediction.area72h / Math.PI) * 1000}
              fillColor="#FF9677"
              fillOpacity={0.1}
              color="#FF9677"
              weight={2}
              dashArray="5,5"
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-orange-600">Propagación 72h</h3>
                  <p className="text-sm">Área: {spreadPrediction.area72h.toFixed(2)} hectáreas</p>
                </div>
              </Popup>
            </Circle>
            
            {/* Spread perimeter points */}
            {spreadPrediction.perimeterPoints.map((point, index) => (
              <Marker
                key={index}
                position={[point.latitude, point.longitude]}
                icon={L.divIcon({
                  html: `<div class="w-3 h-3 rounded-full border-2 border-white shadow-lg" style="background-color: ${getIntensityColor(point.intensity)}"></div>`,
                  iconSize: [12, 12],
                  className: 'custom-div-icon'
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold">Predicción de Propagación</h4>
                    <p className="text-sm">Tiempo estimado: {Math.round(point.timeToReach)}h</p>
                    <p className="text-sm">Intensidad: {point.intensity}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
        
        {/* Evacuation zones */}
        {evacuationZones?.map((zone, zoneIndex) => {
          // Calcular radio para cada zona de evacuación
          const zoneRadius = (zoneIndex + 1) * 2000;
          
          return (
            <React.Fragment key={zone.id}>
              {/* Zona de evacuación */}
              <Circle
                center={center}
                radius={zoneRadius}
                fillColor={getZoneColor(zone.priority)}
                fillOpacity={0.1}
                color={getZoneColor(zone.priority)}
                weight={2}
                eventHandlers={{
                  click: () => setSelectedZone(zone)
                }}
              />
              
              {/* Rutas de evacuación para cada zona */}
              {zone.routes.map((route, routeIndex) => {
                // Calcular ángulo para distribuir las rutas alrededor de la zona
                const routeAngle = (routeIndex * 60 + zoneIndex * 30) % 360;
                
                // Punto de inicio en el borde de la zona de evacuación
                const zoneRadiusDegrees = zoneRadius / 111000; // Convertir metros a grados (aproximado)
                const startPoint: LatLngExpression = [
                  (center as [number, number])[0] + Math.cos(routeAngle * Math.PI / 180) * zoneRadiusDegrees,
                  (center as [number, number])[1] + Math.sin(routeAngle * Math.PI / 180) * zoneRadiusDegrees
                ];
                
                // Generar ruta de evacuación que se aleje del centro
                const routePoints = generateEvacuationRoute(startPoint);
                
                return (
                  <Polyline
                    key={`${zone.id}_route_${routeIndex}`}
                    positions={routePoints}
                    pathOptions={{
                      color: getZoneColor(zone.priority),
                      weight: 3,
                      dashArray: route.status === 'congested' ? '5,10' : route.status === 'blocked' ? '2,10' : undefined
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-semibold">Ruta de Evacuación</h4>
                        <p className="text-sm"><strong>Capacidad:</strong> {route.capacity} personas/hora</p>
                        <p className="text-sm"><strong>Tiempo estimado:</strong> {route.estimatedTime} min</p>
                        <p className="text-sm"><strong>Estado:</strong> {route.status}</p>
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </React.Fragment>
          );
        })}
        
        {/* Fire stations */}
        {resourceAllocation?.fireStations.map((station) => (
          <Marker
            key={station.id}
            position={[
              (center as [number, number])[0] + (Math.random() - 0.5) * 0.1,
              (center as [number, number])[1] + (Math.random() - 0.5) * 0.1
            ]}
            icon={L.divIcon({
              html: `<div style="background-color: #F54768; color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/></svg></div>`,
              iconSize: [24, 24],
              className: 'custom-div-icon'
            })}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {station.id}
                </h4>
                <p className="text-sm">Distancia: {station.distance.toFixed(2)} km</p>
                <p className="text-sm">Tiempo respuesta: {station.responseTime.toFixed(0)} min</p>
                <p className="text-sm">Personal: {station.personnel}</p>
                <p className="text-sm">Estado: {station.availability}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Aircraft */}
        {resourceAllocation?.aircraft.map((aircraft, index) => (
          <Marker
            key={`aircraft-${index}`}
            position={[
              (center as [number, number])[0] + (Math.random() - 0.5) * 0.2,
              (center as [number, number])[1] + (Math.random() - 0.5) * 0.2
            ]}
            icon={L.divIcon({
              html: `<div style="background-color: #3b82f6; color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"/></svg></div>`,
              iconSize: [24, 24],
              className: 'custom-div-icon'
            })}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  {aircraft.type}
                </h4>
                <p className="text-sm">Capacidad: {aircraft.capacity}L</p>
                <p className="text-sm">Alcance: {aircraft.range} km</p>
                <p className="text-sm">ETA: {aircraft.eta.toFixed(2)} min</p>
                <p className="text-sm">Estado: {aircraft.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <h4 className="font-semibold text-sm mb-2">Leyenda</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full opacity-50"></div>
            <span>Propagación 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-orange-600 rounded-full opacity-50"></div>
            <span>Propagación 72h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span>Evacuación inmediata</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
            <span>Evacuación alta</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-3 w-3 text-red-600" />
            <span>Estación bomberos</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="h-3 w-3 text-blue-600" />
            <span>Aeronave</span>
          </div>
        </div>
      </div>
      
      {/* Selected zone info */}
      {selectedZone && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Zona de Evacuación
            </h4>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Prioridad:</span>
              <span className={`font-medium ${
                selectedZone.priority === 'immediate' ? 'text-red-600' :
                selectedZone.priority === 'high' ? 'text-orange-600' :
                selectedZone.priority === 'medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {selectedZone.priority.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Población:</span>
              <span className="font-medium">{selectedZone.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiempo evacuación:</span>
              <span className="font-medium">{selectedZone.timeToEvacuate.toFixed(2)} min</span>
            </div>
            <div className="flex justify-between">
              <span>Rutas disponibles:</span>
              <span className="font-medium">{selectedZone.routes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Refugios:</span>
              <span className="font-medium">{selectedZone.shelters.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FireSpreadMap