import React, { useState, useEffect } from 'react'
import { Shield, Users, Clock, AlertTriangle, CheckCircle, Target, Droplets, Truck, Heart, Building, Navigation, MapPin, Route } from 'lucide-react'
import TacticalMapVisualization from './TacticalMapVisualization'
import StrategyDetailCard from './StrategyDetailCard'

interface TacticalPlanPanelProps {
  alert: any
  organization: any
}

const TacticalPlanPanel: React.FC<TacticalPlanPanelProps> = ({ 
  alert, 
  organization 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'details' | 'resources'>('map')
  const [userLocation, setUserLocation] = useState<{ latitude: number, longitude: number } | undefined>(undefined)
  const { tacticalPlan } = alert.analysis

  // Get user location with improved error handling
  useEffect(() => {
    // Check if browser supports geolocation
    if (navigator.geolocation) {
      console.log('Requesting user location...')
      
      // Increase timeout to 15 seconds and add better error handling
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log('Location obtained successfully')
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error.message)
          // Log the specific error
          switch(error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for geolocation')
              break
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable')
              break
            case error.TIMEOUT:
              console.error('The request to get user location timed out')
              break
            default:
              console.error('An unknown error occurred')
          }
          
          // Simulate location for demonstration
          simulateUserLocation()
        },
        { 
          enableHighAccuracy: true, 
          maximumAge: 30000,     // Accept positions up to 30 seconds old
          timeout: 15000         // Wait up to 15 seconds for a position
        }
      )
      
      return () => navigator.geolocation.clearWatch(watchId)
    } else {
      console.warn('Geolocation is not supported by this browser')
      // Simulate location for demonstration
      simulateUserLocation()
    }
  }, [])

  const simulateUserLocation = () => {
    console.log('Using simulated location')
    // Simulate location near the fire for demonstration
    const fireLocation = alert.fireData.location
    setUserLocation({
      latitude: fireLocation.latitude - 0.01,
      longitude: fireLocation.longitude - 0.01
    })
    
    // Simulate movement
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setUserLocation(prev => {
        if (!prev) return prev
        return {
          latitude: prev.latitude + 0.0005,
          longitude: prev.longitude + 0.0005
        }
      })
      
      if (step > 20) clearInterval(interval)
    }, 10000) // Move every 10 seconds
    
    return () => clearInterval(interval)
  }

  const getOrganizationIcon = (type: string) => {
    switch (type) {
      case 'firefighters': return '🚒'
      case 'medical': return '🚑'
      case 'police': return '👮'
      case 'civil_protection': return '🛡️'
      default: return '🚨'
    }
  }

  const getOrganizationName = (type: string) => {
    switch (type) {
      case 'firefighters': return 'Fire Department'
      case 'medical': return 'Medical Services'
      case 'police': return 'Law Enforcement'
      case 'civil_protection': return 'Civil Protection'
      default: return 'Emergency Organization'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'difficult': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string | number) => {
    if (typeof priority === 'number') {
      if (priority >= 9) return 'text-red-600 bg-red-100'
      if (priority >= 7) return 'text-orange-600 bg-orange-100'
      if (priority >= 5) return 'text-yellow-600 bg-yellow-100'
      return 'text-green-600 bg-green-100'
    }
    
    switch (priority) {
      case 'immediate': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAccessibilityColor = (accessibility: string) => {
    switch (accessibility) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'difficult': return 'text-orange-600'
      case 'extreme': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const tabs = [
    { id: 'map', label: 'Tactical Map', icon: MapPin },
    { id: 'overview', label: 'Summary', icon: Target },
    { id: 'details', label: 'Details', icon: Route },
    { id: 'resources', label: 'Resources', icon: Droplets }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Target className="h-6 w-6 text-blue-600" />
          Tactical Plan - {getOrganizationName(organization.type)}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{getOrganizationIcon(organization.type)}</span>
          <span>{organization.name}</span>
        </div>
      </div>

      {/* Strategy Overview */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Main Strategy</h3>
        <p className="text-blue-800">{tacticalPlan.primaryStrategy}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'map' && (
        <TacticalMapVisualization 
          alert={alert}
          organization={organization}
          userLocation={userLocation}
        />
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Route className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{tacticalPlan.entryRoutes.length}</div>
              <div className="text-sm text-gray-600">Entry Routes</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{tacticalPlan.evacuationRoutes.length}</div>
              <div className="text-sm text-gray-600">Evacuation Routes</div>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{tacticalPlan.criticalZones.length}</div>
              <div className="text-sm text-gray-600">Critical Zones</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Identified Water Resources</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">{tacticalPlan.waterSources.length}</div>
              <div className="text-sm text-gray-600">
                Total capacity: {tacticalPlan.waterSources.reduce((sum: number, source: any) => sum + source.capacity, 0).toLocaleString()} L
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Identified Civilian Areas</h4>
              <div className="text-2xl font-bold text-red-600 mb-1">{tacticalPlan.civilianAreas.length}</div>
              <div className="text-sm text-gray-600">
                Total population: {tacticalPlan.civilianAreas.reduce((sum: number, area: any) => sum + area.population, 0).toLocaleString()} people
              </div>
            </div>
          </div>

          {/* Detailed Strategy */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detailed Strategy
            </h3>
            <StrategyDetailCard 
              strategy={tacticalPlan.primaryStrategy} 
              organizationType={organization.type}
            />
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Entry Routes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Route className="h-5 w-5 text-blue-600" />
              Entry Routes
            </h3>
            <div className="space-y-3">
              {tacticalPlan.entryRoutes.map((route: any, index: number) => (
                <div key={route.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Entry Route {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                        {route.difficulty.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {route.estimatedTime} min
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <h5 className="font-medium text-blue-800 mb-1">Navigation Instructions</h5>
                    <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                      <li>Start from designated meeting point</li>
                      <li>Follow the blue route marked on the map</li>
                      <li>Maintain constant communication with command center</li>
                      <li>Report any obstacles or changing conditions</li>
                      <li>Check control points every 500 meters</li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Start coordinates:</span>
                      <p className="font-medium">{route.coordinates[0].latitude.toFixed(6)}, {route.coordinates[0].longitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">End coordinates:</span>
                      <p className="font-medium">{route.coordinates[route.coordinates.length-1].latitude.toFixed(6)}, {route.coordinates[route.coordinates.length-1].longitude.toFixed(6)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evacuation Routes */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Evacuation Routes
            </h3>
            <div className="space-y-3">
              {tacticalPlan.evacuationRoutes.map((route: any, index: number) => (
                <div key={route.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Evacuation Route {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(route.priority)}`}>
                        {route.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {route.capacity} people/hour
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg mb-3">
                    <h5 className="font-medium text-green-800 mb-1">Evacuation Instructions</h5>
                    <ol className="list-decimal list-inside text-sm text-green-700 space-y-1">
                      <li>Evacuate vulnerable people first (children, elderly, sick)</li>
                      <li>Follow the green route marked on the map</li>
                      <li>Maintain order and calm during movement</li>
                      <li>Proceed to the designated safe meeting point</li>
                      <li>Report anyone needing special assistance</li>
                    </ol>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Meeting point:</span>
                      <p className="font-medium">{route.coordinates[route.coordinates.length-1].latitude.toFixed(6)}, {route.coordinates[route.coordinates.length-1].longitude.toFixed(6)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Evacuation capacity:</span>
                      <p className="font-medium">{route.capacity} people/hour</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          {/* Water Sources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              Available Water Sources
            </h3>
            <div className="space-y-3">
              {tacticalPlan.waterSources.map((source: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{source.type.replace('_', ' ')}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getAccessibilityColor(source.accessibility)}`}>
                        {source.accessibility.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {source.distance.toFixed(1)} km
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium ml-2">{source.capacity.toLocaleString()} L</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Accessibility:</span>
                      <span className={`font-medium ml-2 ${getAccessibilityColor(source.accessibility)}`}>
                        {source.accessibility}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Access Instructions</h5>
                    <p className="text-sm text-blue-700">
                      {source.type === 'river' && 'Access via forest road. Requires pump with at least 10m suction hoses.'}
                      {source.type === 'lake' && 'Access via paved road. Marked loading point for fire engines.'}
                      {source.type === 'reservoir' && 'Restricted access. Contact facility personnel for gate opening.'}
                      {source.type === 'hydrant' && 'Column hydrant. Nominal pressure 5 bar. Requires standard hydrant wrench.'}
                      {source.type === 'tank' && 'Elevated tank. Access via service ladder. Manual opening valve.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Civilian Areas */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Civilian Areas to Protect
            </h3>
            <div className="space-y-3">
              {tacticalPlan.civilianAreas.map((area: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">{area.type.replace('_', ' ')}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(area.evacuationPriority)}`}>
                        PRIORITY {area.evacuationPriority}
                      </span>
                      <span className="text-sm text-gray-600">
                        {area.population} people
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg mb-3">
                    <h5 className="font-medium text-purple-800 mb-1">Specific Instructions</h5>
                    <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                      {area.type === 'residential' && (
                        <>
                          <li>Evacuate by blocks/neighborhoods in orderly fashion</li>
                          <li>Prioritize buildings closest to the fire front</li>
                          <li>Check empty homes and mark them</li>
                        </>
                      )}
                      {area.type === 'hospital' && (
                        <>
                          <li>Coordinate with hospital medical director</li>
                          <li>Prioritize critical patients for transfer</li>
                          <li>Establish field hospital if necessary</li>
                        </>
                      )}
                      {area.type === 'veterinary' && (
                        <>
                          <li>Coordinate with veterinary staff</li>
                          <li>Prioritize evacuation of animals by condition</li>
                          <li>Use special carriers and cages</li>
                        </>
                      )}
                      {area.type === 'school' && (
                        <>
                          <li>Contact school administration</li>
                          <li>Evacuate by classrooms maintaining groups</li>
                          <li>Conduct headcount at meeting point</li>
                        </>
                      )}
                      {area.type === 'commercial' && (
                        <>
                          <li>Coordinate with security managers</li>
                          <li>Use marked emergency exits</li>
                          <li>Evacuate by floors in staggered manner</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  {area.specialNeeds.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium text-orange-600">Special needs:</span>
                      <div className="text-sm text-gray-600 mt-1">
                        {area.specialNeeds.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resource Summary */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3">📊 Resource Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {tacticalPlan.waterSources.reduce((sum: number, source: any) => sum + source.capacity, 0).toLocaleString()}L
                </div>
                <div className="text-green-700">Total Water</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {tacticalPlan.civilianAreas.reduce((sum: number, area: any) => sum + area.population, 0).toLocaleString()}
                </div>
                <div className="text-blue-700">Population</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {tacticalPlan.entryRoutes.length + tacticalPlan.evacuationRoutes.length}
                </div>
                <div className="text-orange-700">Total Routes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {tacticalPlan.criticalZones.length}
                </div>
                <div className="text-purple-700">Critical Zones</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Responsible Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Responsible AI - System Transparency
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          <div><strong>Fairness:</strong> Plan specifically adapted for {getOrganizationName(organization.type)}</div>
          <div><strong>Transparency:</strong> Decisions based on verifiable satellite data and auditable algorithms</div>
          <div><strong>Privacy:</strong> Location data anonymized and protected according to GDPR</div>
          <div><strong>Security:</strong> Recommendations validated by international emergency protocols</div>
          <div><strong>Accountability:</strong> System supervised by certified emergency professionals</div>
        </div>
      </div>
    </div>
  )
}

export default TacticalPlanPanel