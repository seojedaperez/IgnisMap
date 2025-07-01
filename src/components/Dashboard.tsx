import React, { useState, useEffect } from 'react'
import { AlertTriangle, TrendingUp, MapPin, Thermometer, Satellite, Users, Wind, Target } from 'lucide-react'
import RiskMeter from './RiskMeter'
import WeatherCard from './WeatherCard'
import AlertsList from './AlertsList'
import FireRiskChart from './FireRiskChart'
import FireSpreadMap from './FireSpreadMap'
import SatelliteImagery from './SatelliteImagery'
import ResourceAllocation from './ResourceAllocation'
import WindAnalysisDisplay from './WindAnalysisDisplay'
import BiodiversityRiskDisplay from './BiodiversityRiskDisplay'
import TacticalPlansDisplay from './TacticalPlansDisplay'
import MicrosoftTechBadge from './MicrosoftTechBadge'
import { useWeather } from '../contexts/WeatherContext'
import { useAlerts } from '../contexts/AlertContext'
import { useMicrosoftAI } from '../contexts/MicrosoftAIContext'
import { azureService } from '../services/azureService'
import { windAnalysisService } from '../services/windAnalysisService'
import { biodiversityAssessmentService } from '../services/biodiversityAssessmentService'
import { tacticalFirefightingService } from '../services/tacticalFirefightingService'

const Dashboard: React.FC = () => {
  const { currentWeather, loading: weatherLoading } = useWeather()
  const { alerts } = useAlerts()
  const microsoftAI = useMicrosoftAI()
  const [activeTab, setActiveTab] = useState<'overview' | 'satellite' | 'spread' | 'resources' | 'wind' | 'biodiversity' | 'tactical'>('overview')
  const [riskPrediction, setRiskPrediction] = useState<any>(null)
  const [windAnalysis, setWindAnalysis] = useState<any>(null)
  const [biodiversityData, setBiodiversityData] = useState<any>(null)
  const [infrastructureData, setInfrastructureData] = useState<any>(null)
  const [riskAssessment, setRiskAssessment] = useState<any>(null)
  const [tacticalPlans, setTacticalPlans] = useState<any[]>([])
  const [waterSources, setWaterSources] = useState<any[]>([])
  const [firebreakStrategies, setFirebreakStrategies] = useState<any[]>([])
  const [location] = useState({ latitude: 40.4168, longitude: -3.7038 }) // Madrid

  const activeAlerts = alerts.filter(alert => alert.status === 'active')
  const highRiskAlerts = activeAlerts.filter(alert => alert.severity === 'high' || alert.severity === 'extreme')

  // Load comprehensive analysis when weather data is available
  useEffect(() => {
    const loadComprehensiveAnalysis = async () => {
      if (currentWeather && !weatherLoading) {
        try {
          // Use Microsoft AI for fire risk prediction if available
          let prediction;
          if (microsoftAI.isConfigured) {
            const vegetationData = { ndvi: 0.5, dryness: 0.6 };
            const historicalFires = [];
            prediction = await microsoftAI.assessFireRisk(currentWeather, vegetationData, historicalFires);
          } else {
            prediction = await azureService.predictFireRisk(currentWeather, location);
          }
          
          // Load all analysis in parallel for better performance
          const [
            windData,
            biodiversity,
            infrastructure,
            waterSourcesData,
            firebreaksData
          ] = await Promise.all([
            windAnalysisService.analyzeWindPatterns(location, currentWeather),
            biodiversityAssessmentService.assessBiodiversityRisk(location, null),
            biodiversityAssessmentService.assessInfrastructureRisk(location, null),
            tacticalFirefightingService.identifyWaterSources(location),
            tacticalFirefightingService.designFirebreaks(location, currentWeather.windDirection || 180, null)
          ])

          setRiskPrediction(prediction)
          setWindAnalysis(windData)
          setBiodiversityData(biodiversity)
          setInfrastructureData(infrastructure)
          setWaterSources(waterSourcesData)
          setFirebreakStrategies(firebreaksData)

          // Generate risk assessment
          const riskAssess = await biodiversityAssessmentService.generateRiskAssessment(
            biodiversity,
            infrastructure,
            prediction.spreadPrediction
          )
          setRiskAssessment(riskAssess)

          // Generate tactical plans
          const plans = await tacticalFirefightingService.generateTacticalPlans(
            location,
            windData,
            prediction.spreadPrediction,
            riskAssess
          )
          setTacticalPlans(plans)

        } catch (error) {
          console.error('Error loading comprehensive analysis:', error)
        }
      }
    }

    loadComprehensiveAnalysis()
  }, [currentWeather, weatherLoading, location, microsoftAI])

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: TrendingUp },
    { id: 'wind', label: 'Vientos', icon: Wind },
    { id: 'biodiversity', label: 'Riesgo', icon: AlertTriangle },
    { id: 'tactical', label: 'Planes', icon: Target },
    { id: 'satellite', label: 'Satélite', icon: Satellite },
    { id: 'spread', label: 'Propagación', icon: MapPin },
    { id: 'resources', label: 'Recursos', icon: Users }
  ]

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-3xl font-bold text-ember-navy mb-1 sm:mb-2">
          🔥 IgnisMap
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Análisis avanzado con Microsoft Azure, Azure Cognitive Services y modelos tácticos profesionales
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-6">
        <div className="mobile-card bg-white">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-ember-100 rounded-lg">
              <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-ember-coral" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs font-medium text-gray-600">Alertas Activas</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{activeAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="mobile-card bg-white">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-ember-100 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-ember-coral" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs font-medium text-gray-600">Riesgo Alto</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">{highRiskAlerts.length}</p>
            </div>
          </div>
        </div>

        <div className="mobile-card bg-white">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Wind className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs font-medium text-gray-600">Viento Actual</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {weatherLoading ? '...' : `${currentWeather?.windSpeed || '--'} km/h`}
              </p>
            </div>
          </div>
        </div>

        <div className="mobile-card bg-white">
          <div className="flex items-center">
            <div className="p-1.5 sm:p-2 bg-ember-100 rounded-lg">
              <Thermometer className="h-4 w-4 sm:h-6 sm:w-6 text-ember-coral" />
            </div>
            <div className="ml-2 sm:ml-4">
              <p className="text-xs font-medium text-gray-600">Temperatura</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {weatherLoading ? '...' : `${currentWeather?.temperature || '--'}°C`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`mobile-tab ${
                  activeTab === tab.id
                    ? 'border-ember-coral text-ember-coral'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  {tab.label}
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Risk Assessment */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="card">
              <h2 className="text-base sm:text-xl font-semibold text-ember-navy mb-3 sm:mb-4">
                🎯 Evaluación Avanzada de Riesgo de Incendio
              </h2>
              <RiskMeter />
            </div>

            <div className="card">
              <h2 className="text-base sm:text-xl font-semibold text-ember-navy mb-3 sm:mb-4">
                📈 Tendencia de Riesgo con Datos Satelitales (7 días)
              </h2>
              <FireRiskChart />
            </div>

            {/* Executive Summary */}
            {riskAssessment && (
              <div className="card">
                <h2 className="text-base sm:text-xl font-semibold text-ember-navy mb-3 sm:mb-4">
                  📋 Resumen Ejecutivo de Riesgo
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-ember-100 rounded-lg border border-ember-200">
                    <div className="text-lg sm:text-2xl font-bold text-ember-coral">
                      {Math.round(riskAssessment.humanLifeRisk)}
                    </div>
                    <div className="text-xs sm:text-sm text-ember-burgundy">Riesgo Vidas</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg sm:text-2xl font-bold text-green-600">
                      {Math.round(riskAssessment.environmentalRisk)}
                    </div>
                    <div className="text-xs sm:text-sm text-green-700">Riesgo Ambiental</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">
                      {Math.round(riskAssessment.economicRisk)}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-700">Riesgo Económico</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-ember-navy bg-opacity-10 rounded-lg border border-ember-navy border-opacity-20">
                    <div className="text-lg sm:text-2xl font-bold text-ember-navy">
                      {tacticalPlans.length}
                    </div>
                    <div className="text-xs sm:text-sm text-ember-navy">Planes Tácticos</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <WeatherCard />
            <AlertsList />
            
            {/* Microsoft Tech Badge */}
            <MicrosoftTechBadge />
            
            {/* System Status */}
            <div className="card">
              <h3 className="text-sm sm:text-lg font-semibold text-ember-navy mb-2 sm:mb-3">🔧 Estado de Servicios</h3>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span>Azure Cognitive Services</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Microsoft Planetary Computer</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Azure Maps</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Azure Application Insights</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Azure Functions</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Azure Storage</span>
                  <span className="text-green-600">● Operativo</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-sm sm:text-lg font-semibold text-ember-navy mb-2 sm:mb-3">⚡ Acciones Rápidas</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('tactical')}
                  className="w-full text-left p-2 bg-ember-100 hover:bg-ember-200 rounded-lg text-ember-coral text-xs sm:text-sm font-medium"
                >
                  🚨 Ver Planes Tácticos
                </button>
                <button 
                  onClick={() => setActiveTab('wind')}
                  className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-800 text-xs sm:text-sm font-medium"
                >
                  💨 Análisis de Vientos
                </button>
                <button 
                  onClick={() => setActiveTab('biodiversity')}
                  className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-800 text-xs sm:text-sm font-medium"
                >
                  🌿 Evaluación Ambiental
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wind' && windAnalysis && (
        <WindAnalysisDisplay windData={windAnalysis} />
      )}

      {activeTab === 'biodiversity' && biodiversityData && infrastructureData && riskAssessment && (
        <BiodiversityRiskDisplay 
          biodiversityData={biodiversityData}
          infrastructureData={infrastructureData}
          riskAssessment={riskAssessment}
        />
      )}

      {activeTab === 'tactical' && tacticalPlans.length > 0 && (
        <TacticalPlansDisplay 
          tacticalPlans={tacticalPlans}
          waterSources={waterSources}
          firebreakStrategies={firebreakStrategies}
        />
      )}

      {activeTab === 'satellite' && (
        <SatelliteImagery location={location} />
      )}

      {activeTab === 'spread' && riskPrediction?.spreadPrediction && (
        <div className="space-y-4 sm:space-y-6">
          <div className="card">
            <h2 className="text-base sm:text-xl font-semibold text-ember-navy mb-3 sm:mb-4">
              🔥 Predicción de Propagación de Incendios
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center p-2 sm:p-3 bg-ember-100 rounded-lg">
                <h4 className="font-semibold text-ember-coral text-xs sm:text-sm">Velocidad</h4>
                <p className="text-lg sm:text-2xl font-bold text-ember-coral">
                  {riskPrediction.spreadPrediction.speed.toFixed(1)} km/h
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-ember-peach bg-opacity-20 rounded-lg">
                <h4 className="font-semibold text-ember-burgundy text-xs sm:text-sm">Área 24h</h4>
                <p className="text-lg sm:text-2xl font-bold text-ember-burgundy">
                  {riskPrediction.spreadPrediction.area24h.toFixed(0)} ha
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 text-xs sm:text-sm">Área 72h</h4>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {riskPrediction.spreadPrediction.area72h.toFixed(0)} ha
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 text-xs sm:text-sm">Contención</h4>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {Math.round(riskPrediction.spreadPrediction.containmentProbability * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="card p-0 overflow-hidden" style={{ height: '500px' }}>
            <FireSpreadMap
              center={[location.latitude, location.longitude]}
              spreadPrediction={riskPrediction.spreadPrediction}
              evacuationZones={riskPrediction.evacuationZones}
              resourceAllocation={riskPrediction.resourceAllocation}
              className="h-full"
            />
          </div>
        </div>
      )}

      {activeTab === 'resources' && riskPrediction?.resourceAllocation && (
        <ResourceAllocation resourceAllocation={riskPrediction.resourceAllocation} />
      )}
    </div>
  )
}

export default Dashboard
