import React, { createContext, useContext, useState, useEffect } from 'react'
import { weatherService, WeatherData, ForecastData } from '../services/weatherService'
import { azureMapsService } from '../services/azureMapsService'
import { azureConfig } from '../services/azureConfigLoader'

interface WeatherContextType {
  currentWeather: WeatherData | null
  forecast: ForecastData[]
  hourlyData: any[]
  loading: boolean
  error: string | null
  refreshWeather: () => void
  setLocation: (lat: number, lon: number) => void
  configureAzureMaps: (subscriptionKey: string) => void
  serviceStatus: {
    provider: string
    configured: boolean
    capabilities: string[]
    fallbackAvailable: boolean
  }
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider')
  }
  return context
}

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData[]>([])
  const [hourlyData, setHourlyData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocationState] = useState({ lat: 40.4168, lon: -3.7038 }) // Madrid by default
  const [serviceStatus, setServiceStatus] = useState(weatherService.getServiceStatus())

  const configureAzureMaps = (subscriptionKey: string) => {
    // Configure both weather service and Azure Maps service
    weatherService.configure(subscriptionKey)
    azureMapsService.configure(subscriptionKey)
    
    setServiceStatus(weatherService.getServiceStatus())
    console.log('✅ Azure Maps Weather Services configured')
    // Refresh weather data with new configuration
    refreshWeather()
  }

  const refreshWeather = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🌤️ Fetching weather data...')
      console.log('📍 Location:', location)
      
      // Try to use Azure Maps key from config if available
      const mapsKey = azureConfig.getAzureMapsKey()
      if (mapsKey && !serviceStatus.configured) {
        weatherService.configure(mapsKey)
        setServiceStatus(weatherService.getServiceStatus())
      }
      
      // Parallel data gathering for maximum performance
      const [weatherData, forecastData, hourlyWeatherData] = await Promise.all([
        weatherService.getCurrentWeather(location.lat, location.lon),
        weatherService.getForecast(location.lat, location.lon),
        weatherService.getHourlyData(location.lat, location.lon)
      ])
      
      console.log('✅ Weather data received from:', serviceStatus.provider)
      console.log('🌡️ Current temperature:', weatherData.temperature + '°C')
      console.log('💨 Wind speed:', weatherData.windSpeed + ' km/h')
      
      setCurrentWeather(weatherData)
      setForecast(forecastData)
      setHourlyData(hourlyWeatherData)
    } catch (err) {
      console.error('❌ Weather fetch error:', err)
      setError(err instanceof Error ? err.message : 'Error al obtener datos meteorológicos')
    } finally {
      setLoading(false)
    }
  }

  const setLocation = (lat: number, lon: number) => {
    setLocationState({ lat, lon })
  }

  useEffect(() => {
    refreshWeather()
    
    // Refresh weather data every 15 minutes
    const interval = setInterval(refreshWeather, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [location]) // Re-fetch when location changes

  return (
    <WeatherContext.Provider value={{
      currentWeather,
      forecast,
      hourlyData,
      loading,
      error,
      refreshWeather,
      setLocation,
      configureAzureMaps,
      serviceStatus
    }}>
      {children}
    </WeatherContext.Provider>
  )
}