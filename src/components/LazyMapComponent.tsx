import React, { Suspense } from 'react'
import { MapPin } from 'lucide-react'
import { TacticalMapVisualizationProps } from './TacticalMapVisualization'
import { ActiveFiresMapProps } from './ActiveFiresMap'
import { AzureMapComponentProps } from './AzureMapComponent'

// Lazy load map components
const TacticalMapVisualization = React.lazy(() => import('./TacticalMapVisualization'))
const ActiveFiresMap = React.lazy(() => import('./ActiveFiresMap'))
const AzureMapComponent = React.lazy(() => import('./AzureMapComponent'))

interface LazyMapComponentProps {
  type: 'tactical' | 'fires' | 'azure'
  // Union of all possible props from the three map components
  alert?: any
  organization?: any
  userLocation?: { latitude: number, longitude: number }
  monitoringZones?: any[]
  activeAlerts?: any[]
  onAlertSelect?: (alert: any) => void
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
  onMapReady?: (map: any) => void
  fireRiskZones?: Array<{
    id: string
    name: string
    position: [number, number]
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

const MapLoadingSpinner = () => (
  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="flex flex-col items-center space-y-3">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <div className="flex items-center space-x-2 text-gray-600">
        <MapPin className="h-4 w-4" />
        <span>Cargando mapa...</span>
      </div>
    </div>
  </div>
)

const LazyMapComponent: React.FC<LazyMapComponentProps> = ({ type, ...props }) => {
  const renderMap = () => {
    switch (type) {
      case 'tactical':
        return <TacticalMapVisualization {...(props as TacticalMapVisualizationProps)} />
      case 'fires':
        return <ActiveFiresMap {...(props as ActiveFiresMapProps)} />
      case 'azure':
        return <AzureMapComponent {...(props as AzureMapComponentProps)} />
      default:
        return <div>Tipo de mapa no válido</div>
    }
  }

  return (
    <Suspense fallback={<MapLoadingSpinner />}>
      {renderMap()}
    </Suspense>
  )
}

export default LazyMapComponent