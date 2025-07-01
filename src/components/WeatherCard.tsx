import React from 'react'
import { Cloud, Droplets, Wind, RefreshCw } from 'lucide-react'
import { useWeather } from '../contexts/WeatherContext'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

const WeatherCard: React.FC = () => {
  const { currentWeather, loading, refreshWeather } = useWeather()

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  if (!currentWeather) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center">No weather data available</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Current Conditions</h3>
        <button
          onClick={refreshWeather}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-ember-peach bg-opacity-20 rounded-lg">
              <Cloud className="h-4 w-4 sm:h-5 sm:w-5 text-ember-coral" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Temperature</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{currentWeather.temperature}°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Feels like</p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">{currentWeather.feelsLike}°C</p>
          </div>
        </div>

        {/* Humidity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Humidity</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{currentWeather.humidity}%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Dew point</p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">{currentWeather.dewPoint}°C</p>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
              <Wind className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Wind</p>
              <p className="font-semibold text-gray-900 text-sm sm:text-base">{currentWeather.windSpeed} km/h</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Direction</p>
            <p className="text-xs sm:text-sm font-medium text-gray-700">{currentWeather.windDirection}°</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-2 sm:pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Pressure:</span>
            <span className="font-medium">{currentWeather.pressure} hPa</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm mt-1">
            <span className="text-gray-600">Visibility:</span>
            <span className="font-medium">{currentWeather.visibility} km</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm mt-1">
            <span className="text-gray-600">Cloud cover:</span>
            <span className="font-medium">{currentWeather.cloudCover}%</span>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            // Replace 'en' with 'enUS' in format calls
            Updated: {format(new Date(currentWeather.timestamp), 'HH:mm', { locale: enUS })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard