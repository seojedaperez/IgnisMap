import React, { useState, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { EmergencyProvider } from './contexts/EmergencyContext'
import { AlertProvider } from './contexts/AlertContext'
import { WeatherProvider } from './contexts/WeatherContext'
import { MicrosoftAIProvider } from './contexts/MicrosoftAIContext'
import { appInsights } from './services/azureConfigLoader'

// Lazy load heavy components
const WelcomeScreen = React.lazy(() => import('./pages/WelcomeScreen'))
const ZoneConfiguration = React.lazy(() => import('./pages/ZoneConfiguration'))
const EmergencyDashboard = React.lazy(() => import('./pages/EmergencyDashboard'))
const BiodiversityAnalysis = React.lazy(() => import('./pages/BiodiversityAnalysis'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
)

export interface OrganizationConfig {
  name: string
  type: 'firefighters' | 'medical' | 'police' | 'civil_protection' | 'other'
  contactInfo: {
    phone: string
    radio: string
    email: string
  }
  capabilities: string[]
}

export interface MonitoringZone {
  id: string
  name: string
  polygon: Array<{ latitude: number, longitude: number }>
  center: { latitude: number, longitude: number }
  area: number // km²
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
}

function App() {
  const [organizationConfig, setOrganizationConfig] = useState<OrganizationConfig | null>(null)
  const [monitoringZones, setMonitoringZones] = useState<MonitoringZone[]>([])
  const [currentStep, setCurrentStep] = useState<'welcome' | 'zone-config' | 'dashboard'>('welcome')

  // Track page views with Application Insights
  useEffect(() => {
    appInsights.trackPageView({ name: `Step: ${currentStep}` });
  }, [currentStep]);

  const handleOrganizationSetup = (config: OrganizationConfig) => {
    setOrganizationConfig(config)
    setCurrentStep('zone-config')
    appInsights.trackEvent({ name: 'OrganizationConfigured', properties: { type: config.type } });
  }

  const handleZoneConfiguration = (zones: MonitoringZone[]) => {
    setMonitoringZones(zones)
    setCurrentStep('dashboard')
    appInsights.trackEvent({ name: 'ZonesConfigured', properties: { count: zones.length } });
  }

  return (
    <MicrosoftAIProvider>
      <EmergencyProvider>
        <WeatherProvider>
          <AlertProvider>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      currentStep === 'welcome' ? (
                        <WelcomeScreen onSetup={handleOrganizationSetup} />
                      ) : currentStep === 'zone-config' ? (
                        <ZoneConfiguration 
                          organization={organizationConfig!}
                          onZonesConfigured={handleZoneConfiguration}
                        />
                      ) : (
                        <EmergencyDashboard 
                          organization={organizationConfig!}
                          monitoringZones={monitoringZones}
                        />
                      )
                    } 
                  />
                  <Route path="/biodiversity" element={<BiodiversityAnalysis />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </div>
          </AlertProvider>
        </WeatherProvider>
      </EmergencyProvider>
    </MicrosoftAIProvider>
  )
}

export default App