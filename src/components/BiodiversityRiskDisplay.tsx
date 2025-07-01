import React from 'react'
import { Leaf, Users, Building, AlertTriangle, Clock } from 'lucide-react'
import { BiodiversityData, InfrastructureAssessment, RiskAssessment } from '../services/biodiversityAssessmentService'

interface BiodiversityRiskDisplayProps {
  biodiversityData: BiodiversityData
  infrastructureData: InfrastructureAssessment
  riskAssessment: RiskAssessment
  className?: string
}

const BiodiversityRiskDisplay: React.FC<BiodiversityRiskDisplayProps> = ({
  biodiversityData,
  infrastructureData,
  riskAssessment,
  className = ''
}) => {
  const getConservationColor = (status: string) => {
    switch (status) {
      case 'CR': return 'text-red-600 bg-red-100'
      case 'EN': return 'text-orange-600 bg-orange-100'
      case 'VU': return 'text-yellow-600 bg-yellow-100'
      case 'NT': return 'text-blue-600 bg-blue-100'
      case 'LC': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getConservationLabel = (status: string) => {
    switch (status) {
      case 'CR': return 'En Peligro Crítico'
      case 'EN': return 'En Peligro'
      case 'VU': return 'Vulnerable'
      case 'NT': return 'Casi Amenazada'
      case 'LC': return 'Preocupación Menor'
      default: return 'No Evaluada'
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 bg-red-100'
    if (risk >= 60) return 'text-orange-600 bg-orange-100'
    if (risk >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 9) return 'text-red-600 bg-red-100'
    if (priority >= 7) return 'text-orange-600 bg-orange-100'
    if (priority >= 5) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Risk Overview */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Evaluación General de Riesgo</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {Math.round(riskAssessment.overallRisk)}
            </div>
            <div className="text-sm text-red-700">Riesgo General</div>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {Math.round(riskAssessment.humanLifeRisk)}
            </div>
            <div className="text-sm text-orange-700">Vidas Humanas</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Math.round(riskAssessment.environmentalRisk)}
            </div>
            <div className="text-sm text-green-700">Ambiental</div>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {Math.round(riskAssessment.economicRisk)}
            </div>
            <div className="text-sm text-blue-700">Económico</div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {Math.round(riskAssessment.culturalRisk)}
            </div>
            <div className="text-sm text-purple-700">Cultural</div>
          </div>
        </div>
      </div>

      {/* Flora at Risk */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Leaf className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Flora en Riesgo</h3>
        </div>

        <div className="space-y-3">
          {biodiversityData.floraSpecies.map((species, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{species.name}</h4>
                  <p className="text-sm text-gray-600 italic">{species.scientificName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConservationColor(species.conservationStatus)}`}>
                  {getConservationLabel(species.conservationStatus)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Población:</span>
                  <p className="font-medium">{species.population.toLocaleString()} individuos</p>
                </div>
                <div>
                  <span className="text-gray-600">Resistencia al fuego:</span>
                  <p className={`font-medium capitalize ${
                    species.fireResistance === 'high' ? 'text-green-600' :
                    species.fireResistance === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {species.fireResistance}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo de recuperación:</span>
                  <p className="font-medium">{species.recoveryTime} años</p>
                </div>
                <div>
                  <span className="text-gray-600">Valor económico:</span>
                  <p className="font-medium">${species.economicValue.toLocaleString()}</p>
                </div>
              </div>

              {species.criticalHabitat && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                  <span className="text-red-800 font-medium">⚠️ Hábitat Crítico</span> - Pérdida irreversible si se destruye
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Fauna at Risk */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-6 bg-amber-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">🦌</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Fauna en Riesgo</h3>
        </div>

        <div className="space-y-3">
          {biodiversityData.faunaSpecies.map((species, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{species.name}</h4>
                  <p className="text-sm text-gray-600 italic">{species.scientificName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConservationColor(species.conservationStatus)}`}>
                    {getConservationLabel(species.conservationStatus)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(species.evacuationPriority)}`}>
                    Prioridad {species.evacuationPriority}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Población:</span>
                  <p className="font-medium">{species.population} individuos</p>
                </div>
                <div>
                  <span className="text-gray-600">Movilidad:</span>
                  <p className={`font-medium capitalize ${
                    species.mobility === 'high' ? 'text-green-600' :
                    species.mobility === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {species.mobility}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Adaptación al fuego:</span>
                  <p className="font-medium capitalize">{species.fireAdaptation}</p>
                </div>
                <div>
                  <span className="text-gray-600">Época crítica:</span>
                  <p className={`font-medium ${species.criticalBreedingSeason ? 'text-red-600' : 'text-green-600'}`}>
                    {species.criticalBreedingSeason ? 'Sí - Reproducción' : 'No'}
                  </p>
                </div>
              </div>

              {species.evacuationPriority >= 8 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                  <span className="text-red-800 font-medium">🚨 EVACUACIÓN PRIORITARIA</span> - Especie en peligro crítico
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure at Risk */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Building className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Infraestructura en Riesgo</h3>
        </div>

        <div className="space-y-4">
          {/* Civil Buildings */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Edificios Civiles</h4>
            <div className="space-y-2">
              {infrastructureData.civilBuildings.map((building, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 capitalize">{building.type}</h5>
                      <p className="text-sm text-gray-600">{building.id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(building.vulnerabilityScore)}`}>
                      Riesgo: {building.vulnerabilityScore}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Ocupación:</span>
                      <p className="font-medium">{building.occupancy} personas</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Resistencia al fuego:</span>
                      <p className="font-medium">{building.structuralFireRating}h</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Evacuación:</span>
                      <p className={`font-medium capitalize ${
                        building.evacuationComplexity === 'simple' ? 'text-green-600' :
                        building.evacuationComplexity === 'moderate' ? 'text-yellow-600' :
                        building.evacuationComplexity === 'complex' ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {building.evacuationComplexity}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Valor:</span>
                      <p className="font-medium">${(building.economicValue / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>

                  {building.criticalServices.length > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <span className="text-blue-800 font-medium">Servicios críticos:</span> {building.criticalServices.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Government Buildings */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Edificios Gubernamentales</h4>
            <div className="space-y-2">
              {infrastructureData.governmentBuildings.map((building, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 capitalize">{building.type.replace('_', ' ')}</h5>
                      <p className="text-sm text-gray-600">{building.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        building.securityLevel === 'top_secret' ? 'bg-red-100 text-red-800' :
                        building.securityLevel === 'classified' ? 'bg-orange-100 text-orange-800' :
                        building.securityLevel === 'restricted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {building.securityLevel.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(building.strategicImportance)}`}>
                        Importancia: {building.strategicImportance}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="mb-2">
                      <span className="text-gray-600">Operaciones críticas:</span>
                      <p className="font-medium">{building.criticalOperations.join(', ')}</p>
                    </div>
                    
                    {building.continuityPlan && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-green-800 font-medium">✓ Plan de Continuidad Activo</span>
                        {building.backupFacilities.length > 0 && (
                          <p className="text-green-700 text-xs mt-1">
                            Respaldo: {building.backupFacilities.join(', ')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Priority Evacuation Zones */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Zonas de Evacuación Prioritaria</h3>
        </div>

        <div className="space-y-3">
          {riskAssessment.priorityEvacuationZones.map((zone, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{zone.zone}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(zone.priority)}`}>
                  PRIORIDAD {zone.priority}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Población total:</span>
                  <p className="font-medium">{zone.population} personas</p>
                </div>
                <div>
                  <span className="text-gray-600">Población vulnerable:</span>
                  <p className="font-medium text-orange-600">{zone.vulnerablePopulation} personas</p>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo evacuación:</span>
                  <p className="font-medium">{zone.evacuationTime} minutos</p>
                </div>
                <div>
                  <span className="text-gray-600">Transporte necesario:</span>
                  <p className="font-medium">{zone.transportationNeeds.length} tipos</p>
                </div>
              </div>

              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <span className="text-blue-800 font-medium">Transporte requerido:</span>
                <p className="text-blue-700">{zone.transportationNeeds.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Decision Points */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Puntos de Decisión Críticos</h3>
        </div>

        <div className="space-y-3">
          {riskAssessment.criticalDecisionPoints.map((point, index) => (
            <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-800">
                  {new Date(point.time).toLocaleString('es-ES')}
                </span>
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-2">{point.decision}</h4>
              <p className="text-sm text-gray-700 mb-3">{point.consequences}</p>
              
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-800">Alternativas:</span>
                {point.alternatives.map((alternative, altIndex) => (
                  <div key={altIndex} className="text-sm text-gray-700 ml-4">
                    • {alternative}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BiodiversityRiskDisplay