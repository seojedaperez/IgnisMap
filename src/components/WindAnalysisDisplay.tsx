import React from 'react'
import { Wind, AlertTriangle, Clock, TrendingUp, Navigation } from 'lucide-react'
import { WindData, WindForecast, FireSpreadVector } from '../services/windAnalysisService'

interface WindAnalysisDisplayProps {
  windData: {
    currentWind: WindData
    forecast: WindForecast[]
    fireSpreadVectors: FireSpreadVector[]
    criticalWindChanges: Array<{
      time: string
      change: string
      impact: 'low' | 'moderate' | 'high' | 'critical'
      recommendation: string
    }>
  }
  className?: string
}

const WindAnalysisDisplay: React.FC<WindAnalysisDisplayProps> = ({ windData, className = '' }) => {
  const getDirectionName = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'moderate': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Wind Conditions */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Wind className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis de Viento Actual</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Navigation 
              className="h-8 w-8 text-blue-600 mx-auto mb-2" 
              style={{ transform: `rotate(${windData.currentWind.direction}deg)` }}
            />
            <p className="text-2xl font-bold text-blue-600">
              {windData.currentWind.speed} km/h
            </p>
            <p className="text-sm text-blue-700">
              {getDirectionName(windData.currentWind.direction)} ({windData.currentWind.direction}°)
            </p>
          </div>

          <div className="text-center p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <TrendingUp className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-cyan-600">
              {windData.currentWind.gusts.toFixed(0)} km/h
            </p>
            <p className="text-sm text-cyan-700">Ráfagas máximas</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full ${
                windData.currentWind.stability === 'stable' ? 'bg-green-500' :
                windData.currentWind.stability === 'unstable' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
            </div>
            <p className="text-lg font-bold text-purple-600 capitalize">
              {windData.currentWind.stability}
            </p>
            <p className="text-sm text-purple-700">Estabilidad atmosférica</p>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center">
              <div className="w-6 h-1 bg-gray-600 rounded" style={{ 
                opacity: windData.currentWind.turbulence 
              }}></div>
            </div>
            <p className="text-2xl font-bold text-gray-600">
              {Math.round(windData.currentWind.turbulence * 100)}%
            </p>
            <p className="text-sm text-gray-700">Turbulencia</p>
          </div>
        </div>
      </div>

      {/* Fire Spread Vectors */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Navigation className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Vectores de Propagación del Fuego</h3>
        </div>

        <div className="space-y-3">
          {windData.fireSpreadVectors.map((vector, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Navigation 
                    className="h-5 w-5 text-red-600" 
                    style={{ transform: `rotate(${vector.direction}deg)` }}
                  />
                  <span className="font-semibold text-gray-900">
                    {getDirectionName(vector.direction)} ({vector.direction}°)
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(vector.intensity)}`}>
                  {vector.intensity.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Velocidad:</span>
                  <p className="font-medium">{vector.speed.toFixed(1)} m/min</p>
                </div>
                <div>
                  <span className="text-gray-600">Probabilidad:</span>
                  <p className="font-medium">{Math.round(vector.probability * 100)}%</p>
                </div>
                <div>
                  <span className="text-gray-600">Tiempo estimado:</span>
                  <p className="font-medium">{vector.timeToReach} min</p>
                </div>
                <div>
                  <span className="text-gray-600">Consumo combustible:</span>
                  <p className="font-medium">{vector.fuelConsumption} kg/m²</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Wind Changes */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cambios Críticos de Viento Previstos</h3>
        </div>

        {windData.criticalWindChanges.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se prevén cambios críticos en las próximas 24 horas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {windData.criticalWindChanges.map((change, index) => (
              <div key={index} className={`p-4 border rounded-lg ${getImpactColor(change.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">
                      {new Date(change.time).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-50">
                    {change.impact.toUpperCase()}
                  </span>
                </div>
                
                <h4 className="font-semibold mb-1">{change.change}</h4>
                <p className="text-sm mb-3">{change.recommendation}</p>
                
                {change.impact === 'critical' && (
                  <div className="mt-3 p-2 bg-red-600 text-white rounded text-sm font-medium">
                    ⚠️ ACCIÓN INMEDIATA REQUERIDA
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wind Forecast Chart */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pronóstico de Viento (24h)</h3>
        </div>

        <div className="space-y-2">
          {windData.forecast.slice(0, 12).map((forecast, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium w-12">
                  {new Date(forecast.timestamp).getHours().toString().padStart(2, '0')}:00
                </span>
                <Navigation 
                  className="h-4 w-4 text-blue-600" 
                  style={{ transform: `rotate(${forecast.wind.direction}deg)` }}
                />
                <span className="text-sm">
                  {getDirectionName(forecast.wind.direction)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium">{forecast.wind.speed.toFixed(0)} km/h</span>
                <span className="text-gray-600">
                  Ráfagas: {forecast.wind.gusts.toFixed(0)} km/h
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  forecast.wind.stability === 'stable' ? 'bg-green-100 text-green-800' :
                  forecast.wind.stability === 'unstable' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {forecast.wind.stability}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WindAnalysisDisplay