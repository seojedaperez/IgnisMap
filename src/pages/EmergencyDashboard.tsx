import React, { useState, useEffect } from 'react'
import { AlertTriangle, Flame, Wind, Droplets, Users, MapPin, Clock, Target } from 'lucide-react'
import { OrganizationConfig, MonitoringZone } from '../App'
import ActiveFiresMap from '../components/ActiveFiresMap'
import FireAnalysisPanel from '../components/FireAnalysisPanel'
import TacticalPlanPanel from '../components/TacticalPlanPanel'
import { emergencyAnalysisService } from '../services/emergencyAnalysisService'

interface EmergencyDashboardProps {
  organization: OrganizationConfig
  monitoringZones: MonitoringZone[]
}

interface FireAlert {
  id: string
  zone: MonitoringZone
  fireData: {
    location: { latitude: number, longitude: number }
    confidence: number
    brightness: number
    size: number // hectares
    detectionTime: string
    satellite: string
  }
  analysis: {
    magnitudeScore: number // 0-100
    dangerScore: number // 0-100
    spreadPrediction: any
    tacticalPlan: any
  }
  status: 'new' | 'analyzing' | 'ready' | 'responding'
}

const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({ 
  organization, 
  monitoringZones 
}) => {
  const [activeAlerts, setActiveAlerts] = useState<FireAlert[]>([])
  const [selectedAlert, setSelectedAlert] = useState<FireAlert | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Start monitoring for fires in configured zones
    startFireMonitoring()
    
    // Update every 30 seconds
    const interval = setInterval(() => {
      checkForNewFires()
    }, 30000)

    return () => clearInterval(interval)
  }, [monitoringZones])

  const startFireMonitoring = async () => {
    console.log(`🔥 Starting monitoring for ${organization.name}`)
    console.log(`📍 Monitoring ${monitoringZones.length} zones`)
    
    // Initial fire check
    await checkForNewFires()
  }

  const checkForNewFires = async () => {
    if (!isMonitoring) return

    try {
      for (const zone of monitoringZones) {
        // Check for active fires in this zone using NASA FIRMS data
        const fires = await emergencyAnalysisService.detectActiveFires(zone)
        
        for (const fire of fires) {
          // Check if we already have an alert for this fire
          const existingAlert = activeAlerts.find(alert => 
            alert.fireData.location.latitude === fire.latitude &&
            alert.fireData.location.longitude === fire.longitude
          )

          if (!existingAlert) {
            // Create new fire alert
            const newAlert: FireAlert = {
              id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              zone,
              fireData: {
                location: { latitude: fire.latitude, longitude: fire.longitude },
                confidence: fire.confidence,
                brightness: fire.brightness,
                size: fire.size,
                detectionTime: new Date().toISOString(),
                satellite: fire.satellite
              },
              analysis: {
                magnitudeScore: 0,
                dangerScore: 0,
                spreadPrediction: null,
                tacticalPlan: null
              },
              status: 'new'
            }

            setActiveAlerts(prev => [...prev, newAlert])
            
            // Start comprehensive analysis
            analyzeFireAlert(newAlert)
          }
        }
      }
      
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error checking for fires:', error)
    }
  }

  const analyzeFireAlert = async (alert: FireAlert) => {
    try {
      // Update status to analyzing
      setActiveAlerts(prev => prev.map(a => 
        a.id === alert.id ? { ...a, status: 'analyzing' } : a
      ))

      // Perform comprehensive analysis
      const analysis = await emergencyAnalysisService.performComprehensiveAnalysis(
        alert.fireData,
        alert.zone,
        organization
      )

      // Update alert with analysis results
      setActiveAlerts(prev => prev.map(a => 
        a.id === alert.id ? { 
          ...a, 
          analysis,
          status: 'ready'
        } : a
      ))

      console.log(`✅ Analysis completed for alert ${alert.id}`)
      console.log(`📊 Magnitude: ${analysis.magnitudeScore.toFixed(2)}/100`)
      console.log(`⚠️ Danger: ${analysis.dangerScore.toFixed(2)}/100`)

    } catch (error) {
      console.error('Error analyzing fire alert:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'analyzing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'responding': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMagnitudeLevel = (score: number) => {
    if (score >= 80) return { level: 'Extreme', color: 'text-red-600' }
    if (score >= 60) return { level: 'High', color: 'text-orange-600' }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600' }
    return { level: 'Low', color: 'text-green-600' }
  }

  const getDangerLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-600' }
    if (score >= 60) return { level: 'High', color: 'text-orange-600' }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600' }
    return { level: 'Low', color: 'text-green-600' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                Command Center - {organization.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
                <span>Type: {organization.type}</span>
                <span className="hidden md:inline">•</span>
                <span>Zones: {monitoringZones.length}</span>
                <span className="hidden md:inline">•</span>
                <span>Alerts: {activeAlerts.length}</span>
                <span className="hidden md:inline">•</span>
                <span className={`flex items-center gap-1 ${isMonitoring ? 'text-green-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isMonitoring ? 'Active Monitoring' : 'Monitoring Paused'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
              <span className="text-xs md:text-sm text-gray-500 hidden md:inline">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium ${
                  isMonitoring 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isMonitoring ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Alerts Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                Fire Alerts
              </h2>

              {activeAlerts.length === 0 ? (
                <div className="text-center py-6 md:py-8">
                  <Flame className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">No active alerts</p>
                  <p className="text-xs md:text-sm text-gray-400">
                    The system is monitoring {monitoringZones.length} zones
                  </p>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3">
                  {activeAlerts.map((alert) => {
                    const magnitude = getMagnitudeLevel(alert.analysis.magnitudeScore)
                    const danger = getDangerLevel(alert.analysis.dangerScore)
                    
                    return (
                      <div
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`p-3 md:p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedAlert?.id === alert.id 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">{alert.zone.name}</h3>
                          <span className={`px-2 py-0.5 md:py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {alert.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Detection:</span>
                            <span className="font-medium">
                              {new Date(alert.fireData.detectionTime).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Satellite:</span>
                            <span className="font-medium">{alert.fireData.satellite}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-medium">{alert.fireData.confidence}%</span>
                          </div>
                          
                          {alert.status === 'ready' && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Magnitude:</span>
                                <span className={`font-medium ${magnitude.color}`}>
                                  {magnitude.level} ({alert.analysis.magnitudeScore.toFixed(2)}/100)
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Danger:</span>
                                <span className={`font-medium ${danger.color}`}>
                                  {danger.level} ({alert.analysis.dangerScore.toFixed(2)}/100)
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {alert.status === 'analyzing' && (
                          <div className="mt-2 md:mt-3 flex items-center gap-2 text-yellow-600">
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-yellow-600"></div>
                            <span className="text-xs md:text-sm">Analyzing with Azure AI...</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Monitoring Zones - Mobile version */}
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                Monitored Zones
              </h2>
              
              <div className="space-y-2">
                {monitoringZones.map((zone) => (
                  <div key={zone.id} className="p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm md:text-base">{zone.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        zone.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        zone.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        zone.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {zone.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      {zone.area.toFixed(2)} km² • {zone.polygon.length} points
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Analysis */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-4">
              <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Real-Time Situation Map
              </h2>
              <ActiveFiresMap 
                monitoringZones={monitoringZones}
                activeAlerts={activeAlerts}
                onAlertSelect={setSelectedAlert}
              />
            </div>

            {/* Analysis Panel */}
            {selectedAlert && selectedAlert.status === 'ready' && (
              <FireAnalysisPanel 
                alert={selectedAlert}
              />
            )}

            {/* Tactical Plan */}
            {selectedAlert && selectedAlert.status === 'ready' && selectedAlert.analysis.tacticalPlan && (
              <TacticalPlanPanel 
                alert={selectedAlert}
                organization={organization}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyDashboard