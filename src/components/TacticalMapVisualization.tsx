import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import { Users, Droplets, Flame, Heart, MapPin, Clock, Target } from 'lucide-react'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface TacticalMapVisualizationProps {
  alert: any
  organization: any
  userLocation?: { latitude: number, longitude: number }
}

interface RouteProgress {
  routeId: string
  currentPosition: number // 0-100 percentage
  estimatedArrival: string
  nextWaypoint: { latitude: number, longitude: number }
  distanceToNext: number // meters
}

const TacticalMapVisualization: React.FC<TacticalMapVisualizationProps> = ({
  alert,
  organization,
  userLocation
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [routeProgress, setRouteProgress] = useState<RouteProgress[]>([])
  const [showFireSpread, setShowFireSpread] = useState(true)
  const [showEvacuationZones, setShowEvacuationZones] = useState(true)
  const [showResources, setShowResources] = useState(true)
  const [showVeterinary, setShowVeterinary] = useState(true)
  const [showHospitals, setShowHospitals] = useState(true)

  const { tacticalPlan } = alert.analysis
  const fireLocation = alert.fireData.location

  // Simulate route progress in real time
  useEffect(() => {
    const interval = setInterval(() => {
      if (userLocation) {
        updateRouteProgress()
      }
    }, 5000) // Update every 5 seconds
    
    return () => clearInterval(interval)
  }, [userLocation, tacticalPlan])

  // Update route progress based on user location
  const updateRouteProgress = () => {
    if (!userLocation || !tacticalPlan) return
    
    const allRoutes = [
      ...tacticalPlan.entryRoutes,
      ...tacticalPlan.evacuationRoutes
    ]
    
    const progress = allRoutes.map(route => {
      // Calculate progress based on distance between user and route points
      const coordinates = route.coordinates
      let closestPointIndex = 0
      let minDistance = Number.MAX_VALUE
      
      coordinates.forEach((coord: { latitude: number, longitude: number }, index: number) => {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude,
          coord.latitude,
          coord.longitude
        )
        
        if (distance < minDistance) {
          minDistance = distance
          closestPointIndex = index
        }
      })
      
      // Calculate percentage of progress
      const progressPercentage = Math.min(100, Math.round((closestPointIndex / (coordinates.length - 1)) * 100))
      
      // Calculate next waypoint
      const nextWaypointIndex = Math.min(closestPointIndex + 1, coordinates.length - 1)
      const nextWaypoint = coordinates[nextWaypointIndex]
      
      // Calculate estimated arrival time
      const now = new Date()
      const minutesToAdd = route.estimatedTime ? 
        Math.round(route.estimatedTime * (1 - progressPercentage / 100)) : 
        Math.round(15 * (1 - progressPercentage / 100))
      
      now.setMinutes(now.getMinutes() + minutesToAdd)
      
      return {
        routeId: route.id,
        currentPosition: progressPercentage,
        estimatedArrival: now.toLocaleTimeString(),
        nextWaypoint,
        distanceToNext: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          nextWaypoint.latitude,
          nextWaypoint.longitude
        ) * 1000 // convert to meters
      }
    })
    
    setRouteProgress(progress)
  }

  // Calculate distance between two points (haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180)
  }

  // Get color for entry routes
  const getEntryRouteColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#10b981' // green
      case 'moderate': return '#f59e0b' // yellow
      case 'difficult': return '#F54768' // ember-coral
      default: return '#6b7280' // gray
    }
  }

  // Get color for evacuation routes
  const getEvacuationRouteColor = (priority: string): string => {
    switch (priority) {
      case 'immediate': return '#F54768' // ember-coral
      case 'high': return '#FF9677' // ember-peach
      case 'medium': return '#f59e0b' // yellow
      case 'low': return '#10b981' // green
      default: return '#6b7280' // gray
    }
  }

  // Get icon for critical zones
  const getCriticalZoneIcon = (type: string) => {
    const iconSize: [number, number] = [32, 32]
    const iconColor = type === 'suppression' ? '#F54768' : 
                     type === 'protection' ? '#41436A' : '#f59e0b'
    
    return L.divIcon({
      html: `<div style="background-color: ${iconColor}; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${type === 'suppression' ? '🔥' : type === 'protection' ? '🛡️' : '👥'}
            </div>`,
      iconSize,
      className: 'custom-div-icon'
    })
  }

  // Get icon for water sources
  const getWaterSourceIcon = (type: string) => {
    const iconSize: [number, number] = [32, 32]
    const iconColor = '#3b82f6' // blue
    
    return L.divIcon({
      html: `<div style="background-color: ${iconColor}; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${type === 'river' ? '🌊' : type === 'lake' ? '💧' : type === 'hydrant' ? '🚿' : '💦'}
            </div>`,
      iconSize,
      className: 'custom-div-icon'
    })
  }

  // Get icon for civilian areas
  const getCivilianAreaIcon = (type: string) => {
    const iconSize: [number, number] = [32, 32]
    let iconColor = '#41436A' // ember-navy
    
    // Assign colors based on type
    if (type === 'hospital') {
      iconColor = '#6b7280' // gray
    } else if (type === 'veterinary') {
      iconColor = '#ec4899' // pink
    } else if (type === 'residential') {
      iconColor = '#41436A' // ember-navy
    } else if (type === 'school') {
      iconColor = '#974063' // ember-burgundy
    }
    
    return L.divIcon({
      html: `<div style="background-color: ${iconColor}; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${type === 'residential' ? '🏘️' : type === 'hospital' ? '🏥' : type === 'veterinary' ? '🐾' : type === 'school' ? '🏫' : '🏢'}
            </div>`,
      iconSize,
      className: 'custom-div-icon'
    })
  }

  // Get icon for user location
  const getUserLocationIcon = () => {
    return L.divIcon({
      html: `<div style="background-color: #3b82f6; color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 3px solid white;">
              👤
            </div>`,
      iconSize: [40, 40],
      className: 'custom-div-icon'
    })
  }

  // Get icon for fire
  const getFireIcon = () => {
    return L.divIcon({
      html: `<div style="background-color: #F54768; color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 3px solid white; animation: pulse 2s infinite;">
              🔥
            </div>`,
      iconSize: [40, 40],
      className: 'custom-div-icon'
    })
  }

  // Get progress of a specific route
  const getRouteProgress = (routeId: string): RouteProgress | undefined => {
    return routeProgress.find(progress => progress.routeId === routeId)
  }

  // Calculate map center
  const getMapCenter = (): LatLngExpression => {
    return [fireLocation.latitude, fireLocation.longitude]
  }

  // Generate evacuation route coordinates that move away from the fire center
  const generateEvacuationRouteCoordinates = (route: any): LatLngExpression[] => {
    // Get original coordinates
    const coordinates: LatLngExpression[] = route.coordinates.map((point: { latitude: number, longitude: number }) => 
      [point.latitude, point.longitude] as [number, number]
    )
    
    // If we already have defined coordinates, use them
    if (coordinates.length > 1) {
      return coordinates
    }
    
    // If we only have one point or none, generate a route that moves away from the fire
    const startPoint = coordinates[0] || [fireLocation.latitude, fireLocation.longitude]
    
    // Calculate vector from fire to outside
    const dx = startPoint[0] - fireLocation.latitude
    const dy = startPoint[1] - fireLocation.longitude
    
    // Normalize the vector
    const length = Math.sqrt(dx * dx + dy * dy)
    const normalizedDx = dx / (length || 1)
    const normalizedDy = dy / (length || 1)
    
    // If the starting point is very close to the fire, move it a bit outward
    const adjustedStartPoint: LatLngExpression = length < 0.01 ? 
      [fireLocation.latitude + normalizedDx * 0.01, fireLocation.longitude + normalizedDy * 0.01] : 
      startPoint
    
    // Generate end point moving away from the fire
    const endPoint: LatLngExpression = [
      adjustedStartPoint[0] + normalizedDx * 0.03,
      adjustedStartPoint[1] + normalizedDy * 0.03
    ]
    
    return [adjustedStartPoint, endPoint]
  }

  return (
    <div className="space-y-4">
      {/* Map controls */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setShowFireSpread(!showFireSpread)}
          className={`mobile-btn flex items-center gap-1 ${
            showFireSpread ? 'bg-ember-coral text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span className="text-xs sm:text-sm">Fire Spread</span>
        </button>
        <button
          onClick={() => setShowEvacuationZones(!showEvacuationZones)}
          className={`mobile-btn flex items-center gap-1 ${
            showEvacuationZones ? 'bg-ember-navy text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span className="text-xs sm:text-sm">Evacuation Zones</span>
        </button>
        <button
          onClick={() => setShowResources(!showResources)}
          className={`mobile-btn flex items-center gap-1 ${
            showResources ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <Droplets className="h-3.5 w-3.5" />
          <span className="text-xs sm:text-sm">Resources</span>
        </button>
        <button
          onClick={() => setShowVeterinary(!showVeterinary)}
          className={`mobile-btn flex items-center gap-1 ${
            showVeterinary ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="text-xs sm:text-sm">🐾 Veterinary</span>
        </button>
        <button
          onClick={() => setShowHospitals(!showHospitals)}
          className={`mobile-btn flex items-center gap-1 ${
            showHospitals ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="text-xs sm:text-sm">🏥 Hospitals</span>
        </button>
      </div>

      {/* Tactical map */}
      <div style={{ height: '500px' }} className="rounded-lg overflow-hidden border">
        <MapContainer
          center={getMapCenter()}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Active fire */}
          <Marker
            position={[fireLocation.latitude, fireLocation.longitude]}
            icon={getFireIcon()}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-ember-coral mb-2">🔥 Active Fire</h3>
                <div className="space-y-1 text-sm">
                  <div><strong>Zone:</strong> {alert.zone.name}</div>
                  <div><strong>Detection:</strong> {new Date(alert.fireData.detectionTime).toLocaleTimeString()}</div>
                  <div><strong>Satellite:</strong> {alert.fireData.satellite}</div>
                  <div><strong>Confidence:</strong> {alert.fireData.confidence}%</div>
                  <div><strong>Magnitude:</strong> {alert.analysis.magnitudeScore}/100</div>
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* Fire spread */}
          {showFireSpread && alert.analysis.spreadPrediction && (
            <>
              <Circle
                center={[fireLocation.latitude, fireLocation.longitude]}
                radius={Math.sqrt(alert.analysis.spreadPrediction.area24h * 10000 / Math.PI)}
                pathOptions={{ color: '#F54768', fillColor: '#F54768', fillOpacity: 0.2, weight: 2 }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-ember-coral">24h Spread</h3>
                    <p className="text-sm">Area: {alert.analysis.spreadPrediction.area24h.toFixed(0)} hectares</p>
                    <p className="text-sm">Speed: {alert.analysis.spreadPrediction.speed.toFixed(1)} km/h</p>
                  </div>
                </Popup>
              </Circle>
              
              <Circle
                center={[fireLocation.latitude, fireLocation.longitude]}
                radius={Math.sqrt(alert.analysis.spreadPrediction.area72h * 10000 / Math.PI)}
                pathOptions={{ color: '#FF9677', fillColor: '#FF9677', fillOpacity: 0.1, weight: 2, dashArray: '5,5' }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-ember-peach">72h Spread</h3>
                    <p className="text-sm">Area: {alert.analysis.spreadPrediction.area72h.toFixed(0)} hectares</p>
                  </div>
                </Popup>
              </Circle>
            </>
          )}
          
          {/* Entry routes */}
          {tacticalPlan.entryRoutes.map((route: any) => {
            const coordinates: LatLngExpression[] = route.coordinates.map((point: { latitude: number, longitude: number }) => 
              [point.latitude, point.longitude] as [number, number]
            )
            
            const routeColor = getEntryRouteColor(route.difficulty)
            const progress = getRouteProgress(route.id)
            
            return (
              <React.Fragment key={route.id}>
                <Polyline
                  positions={coordinates}
                  pathOptions={{ 
                    color: routeColor, 
                    weight: selectedRoute === route.id ? 6 : 4,
                    opacity: selectedRoute === route.id ? 1 : 0.7,
                    dashArray: '10,5'
                  }}
                  eventHandlers={{
                    click: () => setSelectedRoute(route.id)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">Entry Route</h3>
                      <p className="text-sm"><strong>Difficulty:</strong> {route.difficulty}</p>
                      <p className="text-sm"><strong>Estimated time:</strong> {route.estimatedTime} min</p>
                      {progress && (
                        <>
                          <p className="text-sm"><strong>Progress:</strong> {progress.currentPosition}%</p>
                          <p className="text-sm"><strong>ETA:</strong> {progress.estimatedArrival}</p>
                          <p className="text-sm"><strong>Distance to next point:</strong> {progress.distanceToNext.toFixed(0)}m</p>
                        </>
                      )}
                    </div>
                  </Popup>
                </Polyline>
                
                {/* Start and end markers */}
                <Marker
                  position={coordinates[0]}
                  icon={L.divIcon({
                    html: `<div style="background-color: ${routeColor}; color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">A</div>`,
                    iconSize: [24, 24],
                    className: 'custom-div-icon'
                  })}
                />
                
                <Marker
                  position={coordinates[coordinates.length - 1]}
                  icon={L.divIcon({
                    html: `<div style="background-color: ${routeColor}; color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">B</div>`,
                    iconSize: [24, 24],
                    className: 'custom-div-icon'
                  })}
                />
              </React.Fragment>
            )
          })}
          
          {/* Evacuation routes */}
          {tacticalPlan.evacuationRoutes.map((route: any) => {
            // Generate coordinates that move away from the fire center
            const coordinates = generateEvacuationRouteCoordinates(route)
            
            const routeColor = getEvacuationRouteColor(route.priority)
            
            return (
              <React.Fragment key={route.id}>
                <Polyline
                  positions={coordinates}
                  pathOptions={{ 
                    color: routeColor, 
                    weight: selectedRoute === route.id ? 6 : 4,
                    opacity: selectedRoute === route.id ? 1 : 0.7
                  }}
                  eventHandlers={{
                    click: () => setSelectedRoute(route.id)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold">Evacuation Route</h3>
                      <p className="text-sm"><strong>Priority:</strong> {route.priority}</p>
                      <p className="text-sm"><strong>Capacity:</strong> {route.capacity} people/hour</p>
                    </div>
                  </Popup>
                </Polyline>
                
                {/* Evacuation markers */}
                <Marker
                  position={coordinates[coordinates.length - 1]}
                  icon={L.divIcon({
                    html: `<div style="background-color: ${routeColor}; color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚶</div>`,
                    iconSize: [28, 28],
                    className: 'custom-div-icon'
                  })}
                />
              </React.Fragment>
            )
          })}
          
          {/* Critical zones */}
          {showResources && tacticalPlan.criticalZones.map((zone: any, index: number) => (
            <Marker
              key={index}
              position={[zone.location.latitude, zone.location.longitude]}
              icon={getCriticalZoneIcon(zone.type)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold capitalize">{zone.type.replace('_', ' ')}</h3>
                  <p className="text-sm"><strong>Priority:</strong> {zone.priority}/10</p>
                  <p className="text-sm">{zone.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Water sources */}
          {showResources && tacticalPlan.waterSources.map((source: any, index: number) => (
            <Marker
              key={index}
              position={[source.location.latitude, source.location.longitude]}
              icon={getWaterSourceIcon(source.type)}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-blue-600 capitalize">{source.type.replace('_', ' ')}</h3>
                  <p className="text-sm"><strong>Capacity:</strong> {source.capacity.toLocaleString()} L</p>
                  <p className="text-sm"><strong>Distance:</strong> {source.distance.toFixed(1)} km</p>
                  <p className="text-sm"><strong>Accessibility:</strong> {source.accessibility}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Civilian areas */}
          {showEvacuationZones && tacticalPlan.civilianAreas.map((area: any, index: number) => {
            // Filter based on toggles
            if ((area.type === 'hospital' && !showHospitals) || 
                (area.type === 'veterinary' && !showVeterinary)) {
              return null;
            }
            
            return (
              <Marker
                key={index}
                position={[area.location.latitude, area.location.longitude]}
                icon={getCivilianAreaIcon(area.type)}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold capitalize">{area.type.replace('_', ' ')}</h3>
                    <p className="text-sm"><strong>Population:</strong> {area.population.toLocaleString()} people</p>
                    <p className="text-sm"><strong>Evacuation priority:</strong> {area.evacuationPriority}/10</p>
                    {area.specialNeeds.length > 0 && (
                      <p className="text-sm"><strong>Special needs:</strong> {area.specialNeeds.join(', ')}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          {/* User location */}
          {userLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={getUserLocationIcon()}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-blue-600">Your current location</h3>
                  <p className="text-sm">{userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Map legend - Mobile optimized version */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span>Easy Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-yellow-500"></div>
          <span>Moderate Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-ember-coral"></div>
          <span>Difficult Route</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-ember-coral"></div>
          <span>Immediate Evacuation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-ember-peach"></div>
          <span>High Evacuation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-yellow-500"></div>
          <span>Medium Evacuation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-500"></div>
          <span>Low Evacuation</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-ember-coral"></div>
          <span>Suppression Zone</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Water Source</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-ember-navy"></div>
          <span>Residential Area</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Hospital</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Veterinary</span>
        </div>
      </div>
    </div>
  )
}

export default TacticalMapVisualization