import React from 'react'
import { Truck, Plane, Droplets, Users, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { ResourceAllocation as ResourceAllocationType } from '../services/azureService'

interface ResourceAllocationProps {
  resourceAllocation: ResourceAllocationType
  className?: string
}

const ResourceAllocation: React.FC<ResourceAllocationProps> = ({ 
  resourceAllocation, 
  className = '' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'deployed': return 'text-orange-600 bg-orange-100'
      case 'maintenance': return 'text-red-600 bg-red-100'
      case 'refueling': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAccessibilityColor = (accessibility: string) => {
    switch (accessibility) {
      case 'good': return 'text-green-600'
      case 'moderate': return 'text-yellow-600'
      case 'difficult': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Recommended Deployment */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Despliegue Recomendado</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">
              {resourceAllocation.recommendedDeployment.groundCrews}
            </p>
            <p className="text-sm text-red-700">Equipos terrestres</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Plane className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {resourceAllocation.recommendedDeployment.aircraft}
            </p>
            <p className="text-sm text-blue-700">Aeronaves</p>
          </div>

          <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <Truck className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-cyan-600">
              {resourceAllocation.recommendedDeployment.waterTenders}
            </p>
            <p className="text-sm text-cyan-700">Camiones cisterna</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">
              {resourceAllocation.recommendedDeployment.commandUnits}
            </p>
            <p className="text-sm text-purple-700">Unidades comando</p>
          </div>
        </div>
      </div>

      {/* Fire Stations */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Truck className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Estaciones de Bomberos</h3>
        </div>

        <div className="space-y-3">
          {resourceAllocation.fireStations.map((station) => (
            <div key={station.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{station.id}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.availability)}`}>
                  {station.availability}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{station.distance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{station.responseTime.toFixed(0)} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{station.personnel} bomberos</span>
                </div>
                <div className="text-xs text-gray-600">
                  Equipos: {station.equipment.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aircraft Resources */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Plane className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recursos Aéreos</h3>
        </div>

        <div className="space-y-3">
          {resourceAllocation.aircraft.map((aircraft, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 capitalize">
                  {aircraft.type}
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(aircraft.status)}`}>
                  {aircraft.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{aircraft.capacity.toLocaleString()}L</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{aircraft.range} km alcance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>ETA: {aircraft.eta.toFixed(0)} min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Water Sources */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Droplets className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fuentes de Agua</h3>
        </div>

        <div className="space-y-3">
          {resourceAllocation.waterSources.map((source) => (
            <div key={source.id} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{source.id}</h4>
                <span className="text-sm text-gray-600 capitalize">{source.type}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span>{source.capacity.toLocaleString()}L</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{source.distance.toFixed(1)} km</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${getAccessibilityColor(source.accessibility)}`}>
                    Acceso: {source.accessibility}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Strategy */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estrategia de Despliegue</h3>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Fase 1: Respuesta Inicial (0-30 min)</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Desplegar {Math.ceil(resourceAllocation.recommendedDeployment.groundCrews / 2)} equipos terrestres más cercanos</li>
              <li>• Activar {resourceAllocation.recommendedDeployment.commandUnits} unidad(es) de comando</li>
              <li>• Preparar recursos aéreos para despliegue inmediato</li>
            </ul>
          </div>

          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Fase 2: Refuerzo (30-60 min)</h4>
            <ul className="space-y-1 text-orange-700">
              <li>• Desplegar recursos aéreos disponibles</li>
              <li>• Activar equipos terrestres adicionales</li>
              <li>• Establecer líneas de suministro de agua</li>
            </ul>
          </div>

          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Fase 3: Contención (1-4 horas)</h4>
            <ul className="space-y-1 text-red-700">
              <li>• Desplegar todos los recursos recomendados</li>
              <li>• Establecer perímetro de contención</li>
              <li>• Coordinar evacuaciones si es necesario</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResourceAllocation