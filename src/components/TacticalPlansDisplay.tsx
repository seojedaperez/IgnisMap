import React, { useState } from 'react'
import { Shield, Users, Clock, AlertTriangle, CheckCircle, Target, Droplets, Truck } from 'lucide-react'
import { TacticalPlan, WaterSource, FirebreakStrategy } from '../services/tacticalFirefightingService'

interface TacticalPlansDisplayProps {
  tacticalPlans: TacticalPlan[]
  waterSources: WaterSource[]
  firebreakStrategies: FirebreakStrategy[]
  className?: string
}

const TacticalPlansDisplay: React.FC<TacticalPlansDisplayProps> = ({
  tacticalPlans,
  waterSources,
  firebreakStrategies,
  className = ''
}) => {
  const [selectedPlan, setSelectedPlan] = useState<TacticalPlan | null>(tacticalPlans[0] || null)
  const [activeTab, setActiveTab] = useState<'plans' | 'water' | 'firebreaks'>('plans')

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'extreme': return 'text-red-600 bg-red-100 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
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

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 0.9) return 'text-green-600'
    if (effectiveness >= 0.7) return 'text-blue-600'
    if (effectiveness >= 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-fire-500 text-fire-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Shield className="h-5 w-5" />
            Planes Tácticos
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'water'
                ? 'border-fire-500 text-fire-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Droplets className="h-5 w-5" />
            Fuentes de Agua
          </button>
          <button
            onClick={() => setActiveTab('firebreaks')}
            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'firebreaks'
                ? 'border-fire-500 text-fire-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Target className="h-5 w-5" />
            Cortafuegos
          </button>
        </nav>
      </div>

      {/* Tactical Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans List */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estrategias Disponibles</h3>
              <div className="space-y-3">
                {tacticalPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlan?.id === plan.id
                        ? 'border-fire-500 bg-fire-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{plan.name}</span>
                      <span className="text-xs font-bold text-fire-600">#{plan.priority}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${getRiskColor(plan.riskLevel)}`}>
                        {plan.riskLevel.toUpperCase()}
                      </span>
                      <span className="text-gray-600">
                        {Math.round(plan.successProbability * 100)}% éxito
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <div className="space-y-6">
                {/* Plan Overview */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{selectedPlan.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(selectedPlan.riskLevel)}`}>
                      RIESGO {selectedPlan.riskLevel.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-600">{selectedPlan.personnelRequired}</div>
                      <div className="text-xs text-blue-700">Personal</div>
                    </div>

                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">{selectedPlan.estimatedDuration}h</div>
                      <div className="text-xs text-green-700">Duración</div>
                    </div>

                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-purple-600">{Math.round(selectedPlan.successProbability * 100)}%</div>
                      <div className="text-xs text-purple-700">Éxito</div>
                    </div>

                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-orange-600">{Math.round(selectedPlan.casualties.firefighterRisk * 100)}%</div>
                      <div className="text-xs text-orange-700">Riesgo Personal</div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm text-red-800 font-medium">Riesgo Civiles</div>
                      <div className="text-2xl font-bold text-red-600">
                        {Math.round(selectedPlan.casualties.civilianRisk * 100)}%
                      </div>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-sm text-orange-800 font-medium">Riesgo Bomberos</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(selectedPlan.casualties.firefighterRisk * 100)}%
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-800 font-medium">Impacto Ambiental</div>
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(selectedPlan.casualties.environmentalImpact * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Equipment Required */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Equipamiento Requerido</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedPlan.equipmentRequired.map((equipment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Truck className="h-4 w-4 text-gray-600" />
                          <span className="text-sm">{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Phases */}
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-4">Fases de Ejecución</h4>
                  <div className="space-y-4">
                    {selectedPlan.phases.map((phase, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-gray-900">
                            Fase {phase.phase}: {phase.name}
                          </h5>
                          <span className="text-sm text-gray-600">
                            {phase.duration} minutos
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-gray-800 mb-2">Objetivos</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {phase.objectives.map((objective, objIndex) => (
                                <li key={objIndex} className="flex items-start gap-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  {objective}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h6 className="font-medium text-gray-800 mb-2">Medidas de Seguridad</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {phase.safetyMeasures.map((measure, measureIndex) => (
                                <li key={measureIndex} className="flex items-start gap-2">
                                  <span className="text-orange-600 mt-1">⚠</span>
                                  {measure}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <h6 className="font-medium text-blue-800 mb-2">Criterios de Éxito</h6>
                          <div className="text-sm text-blue-700">
                            {phase.successCriteria.join(' • ')}
                          </div>
                        </div>

                        {phase.fallbackOptions.length > 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                            <h6 className="font-medium text-yellow-800 mb-2">Opciones de Contingencia</h6>
                            <div className="text-sm text-yellow-700">
                              {phase.fallbackOptions.join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Factors & Contingencies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h4 className="font-semibold text-gray-900 mb-3">Factores Críticos</h4>
                    <ul className="space-y-2">
                      {selectedPlan.criticalFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card">
                    <h4 className="font-semibold text-gray-900 mb-3">Planes de Contingencia</h4>
                    <ul className="space-y-2">
                      {selectedPlan.contingencyPlans.map((plan, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un plan táctico para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Water Sources Tab */}
      {activeTab === 'water' && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Droplets className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Fuentes de Agua Disponibles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {waterSources.map((source) => (
              <div key={source.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{source.id}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getAccessibilityColor(source.accessibility)} bg-opacity-10`}>
                    {source.accessibility}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">{source.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacidad:</span>
                    <span className="font-medium">{(source.capacity / 1000).toFixed(0)}k L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Caudal:</span>
                    <span className="font-medium">{source.flowRate} L/min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distancia:</span>
                    <span className="font-medium">{source.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo setup:</span>
                    <span className="font-medium">{source.setupTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confiabilidad:</span>
                    <span className="font-medium">{Math.round(source.reliability * 100)}%</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className={`text-xs font-medium ${
                    source.reliability > 0.9 ? 'text-green-600' :
                    source.reliability > 0.8 ? 'text-blue-600' :
                    source.reliability > 0.7 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {source.reliability > 0.9 ? '✓ ALTAMENTE CONFIABLE' :
                     source.reliability > 0.8 ? '✓ CONFIABLE' :
                     source.reliability > 0.7 ? '⚠ MODERADAMENTE CONFIABLE' : '⚠ BAJA CONFIABILIDAD'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Firebreaks Tab */}
      {activeTab === 'firebreaks' && (
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Estrategias de Cortafuegos</h3>
          </div>

          <div className="space-y-4">
            {firebreakStrategies.map((strategy) => (
              <div key={strategy.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize">{strategy.type.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">{strategy.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEffectivenessColor(strategy.effectiveness)}`}>
                      {Math.round(strategy.effectiveness * 100)}% efectivo
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.riskToPersonnel)}`}>
                      {strategy.riskToPersonnel} riesgo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Ancho:</span>
                    <p className="font-medium">{strategy.width}m</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Longitud:</span>
                    <p className="font-medium">{(strategy.length / 1000).toFixed(1)}km</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Tiempo construcción:</span>
                    <p className="font-medium">{strategy.constructionTime}h</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Impacto ambiental:</span>
                    <p className={`font-medium capitalize ${
                      strategy.environmentalImpact === 'minimal' ? 'text-green-600' :
                      strategy.environmentalImpact === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {strategy.environmentalImpact}
                    </p>
                  </div>
                </div>

                {/* Risk Warnings */}
                {strategy.riskToPersonnel === 'extreme' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-red-800 font-medium">RIESGO EXTREMO</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Esta operación requiere personal altamente especializado y condiciones meteorológicas ideales.
                      Alto riesgo de bajas si no se ejecuta correctamente.
                    </p>
                  </div>
                )}

                {strategy.type === 'backfire' && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-orange-800 font-medium">OPERACIÓN DE ALTO RIESGO</span>
                    </div>
                    <p className="text-orange-700 text-sm mt-1">
                      Contrafuego requiere condiciones meteorológicas estables y personal experto.
                      Puede resultar contraproducente si las condiciones cambian.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TacticalPlansDisplay