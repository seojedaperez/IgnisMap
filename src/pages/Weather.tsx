import React from 'react'
import { Cloud, Droplets, Wind, Eye, Thermometer, Gauge } from 'lucide-react'
import { useWeather } from '../contexts/WeatherContext'
import WeatherChart from '../components/WeatherChart'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Weather: React.FC = () => {
  const { currentWeather, forecast, loading } = useWeather()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Datos Meteorológicos</h1>
        <p className="text-gray-600">Información meteorológica en tiempo real para análisis de riesgo</p>
      </div>

      {/* Current Weather */}
      {currentWeather && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Condiciones Actuales</h2>
            <p className="text-sm text-gray-500">
              Actualizado: {format(new Date(currentWeather.timestamp), 'dd MMM yyyy, HH:mm', { locale: es })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Thermometer className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Temperatura</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.temperature}°C</p>
                <p className="text-sm text-gray-500">Sensación: {currentWeather.feelsLike}°C</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Humedad</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.humidity}%</p>
                <p className="text-sm text-gray-500">Punto de rocío: {currentWeather.dewPoint}°C</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Wind className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Viento</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.windSpeed} km/h</p>
                <p className="text-sm text-gray-500">Dirección: {currentWeather.windDirection}°</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Gauge className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Presión</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.pressure} hPa</p>
                <p className="text-sm text-gray-500">Nivel del mar</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Eye className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Visibilidad</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.visibility} km</p>
                <p className="text-sm text-gray-500">Condiciones claras</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Cloud className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Nubosidad</p>
                <p className="text-2xl font-bold text-gray-900">{currentWeather.cloudCover}%</p>
                <p className="text-sm text-gray-500">{currentWeather.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Chart */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tendencia Meteorológica (24h)</h2>
        <WeatherChart />
      </div>

      {/* Forecast */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pronóstico Extendido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="font-medium text-gray-900">
                  {format(new Date(day.date), 'EEE dd', { locale: es })}
                </p>
                <div className="my-3">
                  <Cloud className="h-8 w-8 text-gray-600 mx-auto" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">
                    {day.maxTemp}° / {day.minTemp}°
                  </p>
                  <p className="text-sm text-gray-600">{day.description}</p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {day.humidity}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-3 w-3" />
                      {day.windSpeed} km/h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fire Weather Index */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Índice Meteorológico de Incendios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">Índice de Sequía</h3>
            <p className="text-3xl font-bold text-yellow-600">65</p>
            <p className="text-sm text-yellow-700 mt-1">Moderado</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-semibold text-orange-800 mb-2">Índice de Propagación</h3>
            <p className="text-3xl font-bold text-orange-600">42</p>
            <p className="text-sm text-orange-700 mt-1">Alto</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Índice de Peligro</h3>
            <p className="text-3xl font-bold text-red-600">78</p>
            <p className="text-sm text-red-700 mt-1">Muy Alto</p>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Recomendaciones</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Evitar actividades que puedan generar chispas</li>
            <li>• Mantener vigilancia extrema en zonas forestales</li>
            <li>• Preparar equipos de extinción preventiva</li>
            <li>• Monitorear cambios en las condiciones meteorológicas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Weather