// Azure Maps Weather Services Integration
// Professional weather data from Microsoft + AccuWeather

interface AzureWeatherConfig {
  subscriptionKey: string
  baseUrl: string
}

interface AzureCurrentWeatherResponse {
  results: Array<{
    dateTime: string
    phrase: string
    iconCode: number
    hasPrecipitation: boolean
    isDayTime: boolean
    temperature: {
      value: number
      unit: string
      unitType: number
    }
    realFeelTemperature: {
      value: number
      unit: string
      unitType: number
    }
    realFeelTemperatureShade: {
      value: number
      unit: string
      unitType: number
    }
    relativeHumidity: number
    dewPoint: {
      value: number
      unit: string
      unitType: number
    }
    wind: {
      direction: {
        degrees: number
        localizedDescription: string
      }
      speed: {
        value: number
        unit: string
        unitType: number
      }
    }
    windGust: {
      speed: {
        value: number
        unit: string
        unitType: number
      }
    }
    uvIndex: number
    uvIndexPhrase: string
    visibility: {
      value: number
      unit: string
      unitType: number
    }
    obstructionsToVisibility: string
    cloudCover: number
    ceiling: {
      value: number
      unit: string
      unitType: number
    }
    pressure: {
      value: number
      unit: string
      unitType: number
    }
    pressureTendency: {
      localizedDescription: string
      code: string
    }
    past24HourTemperatureDeparture: {
      value: number
      unit: string
      unitType: number
    }
    apparentTemperature: {
      value: number
      unit: string
      unitType: number
    }
    windChillTemperature: {
      value: number
      unit: string
      unitType: number
    }
    wetBulbTemperature: {
      value: number
      unit: string
      unitType: number
    }
    precipitationSummary: {
      pastHour: {
        value: number
        unit: string
        unitType: number
      }
      past3Hours: {
        value: number
        unit: string
        unitType: number
      }
      past6Hours: {
        value: number
        unit: string
        unitType: number
      }
      past9Hours: {
        value: number
        unit: string
        unitType: number
      }
      past12Hours: {
        value: number
        unit: string
        unitType: number
      }
      past18Hours: {
        value: number
        unit: string
        unitType: number
      }
      past24Hours: {
        value: number
        unit: string
        unitType: number
      }
    }
    temperatureSummary: {
      past6Hours: {
        minimum: {
          value: number
          unit: string
          unitType: number
        }
        maximum: {
          value: number
          unit: string
          unitType: number
        }
      }
      past12Hours: {
        minimum: {
          value: number
          unit: string
          unitType: number
        }
        maximum: {
          value: number
          unit: string
          unitType: number
        }
      }
      past24Hours: {
        minimum: {
          value: number
          unit: string
          unitType: number
        }
        maximum: {
          value: number
          unit: string
          unitType: number
        }
      }
    }
  }>
}

interface AzureForecastResponse {
  summary: {
    startDate: string
    endDate: string
    severity: number
    phrase: string
    category: string
  }
  forecasts: Array<{
    date: string
    temperature: {
      minimum: {
        value: number
        unit: string
        unitType: number
      }
      maximum: {
        value: number
        unit: string
        unitType: number
      }
    }
    realFeelTemperature: {
      minimum: {
        value: number
        unit: string
        unitType: number
      }
      maximum: {
        value: number
        unit: string
        unitType: number
      }
    }
    realFeelTemperatureShade: {
      minimum: {
        value: number
        unit: string
        unitType: number
      }
      maximum: {
        value: number
        unit: string
        unitType: number
      }
    }
    hoursOfSun: number
    degreeDaySummary: {
      heating: {
        value: number
        unit: string
        unitType: number
      }
      cooling: {
        value: number
        unit: string
        unitType: number
      }
    }
    airAndPollen: Array<{
      name: string
      value: number
      category: string
      categoryValue: number
      type: string
    }>
    day: {
      iconCode: number
      iconPhrase: string
      hasPrecipitation: boolean
      precipitationType: string
      precipitationIntensity: string
      shortPhrase: string
      longPhrase: string
      precipitationProbability: number
      thunderstormProbability: number
      rainProbability: number
      snowProbability: number
      iceProbability: number
      wind: {
        direction: {
          degrees: number
          localizedDescription: string
        }
        speed: {
          value: number
          unit: string
          unitType: number
        }
      }
      windGust: {
        direction: {
          degrees: number
          localizedDescription: string
        }
        speed: {
          value: number
          unit: string
          unitType: number
        }
      }
      totalLiquid: {
        value: number
        unit: string
        unitType: number
      }
      rain: {
        value: number
        unit: string
        unitType: number
      }
      snow: {
        value: number
        unit: string
        unitType: number
      }
      ice: {
        value: number
        unit: string
        unitType: number
      }
      hoursOfPrecipitation: number
      hoursOfRain: number
      hoursOfSnow: number
      hoursOfIce: number
      cloudCover: number
    }
    night: {
      iconCode: number
      iconPhrase: string
      hasPrecipitation: boolean
      precipitationType: string
      precipitationIntensity: string
      shortPhrase: string
      longPhrase: string
      precipitationProbability: number
      thunderstormProbability: number
      rainProbability: number
      snowProbability: number
      iceProbability: number
      wind: {
        direction: {
          degrees: number
          localizedDescription: string
        }
        speed: {
          value: number
          unit: string
          unitType: number
        }
      }
      windGust: {
        direction: {
          degrees: number
          localizedDescription: string
        }
        speed: {
          value: number
          unit: string
          unitType: number
        }
      }
      totalLiquid: {
        value: number
        unit: string
        unitType: number
      }
      rain: {
        value: number
        unit: string
        unitType: number
      }
      snow: {
        value: number
        unit: string
        unitType: number
      }
      ice: {
        value: number
        unit: string
        unitType: number
      }
      hoursOfPrecipitation: number
      hoursOfRain: number
      hoursOfSnow: number
      hoursOfIce: number
      cloudCover: number
    }
    sources: string[]
  }>
}

interface AzureHourlyForecastResponse {
  forecasts: Array<{
    date: string
    iconCode: number
    iconPhrase: string
    hasPrecipitation: boolean
    isDaylight: boolean
    temperature: {
      value: number
      unit: string
      unitType: number
    }
    realFeelTemperature: {
      value: number
      unit: string
      unitType: number
    }
    wetBulbTemperature: {
      value: number
      unit: string
      unitType: number
    }
    dewPoint: {
      value: number
      unit: string
      unitType: number
    }
    wind: {
      direction: {
        degrees: number
        localizedDescription: string
      }
      speed: {
        value: number
        unit: string
        unitType: number
      }
    }
    windGust: {
      speed: {
        value: number
        unit: string
        unitType: number
      }
    }
    relativeHumidity: number
    visibility: {
      value: number
      unit: string
      unitType: number
    }
    cloudCover: number
    ceiling: {
      value: number
      unit: string
      unitType: number
    }
    uvIndex: number
    uvIndexPhrase: string
    precipitationProbability: number
    rainProbability: number
    snowProbability: number
    iceProbability: number
    totalLiquid: {
      value: number
      unit: string
      unitType: number
    }
    rain: {
      value: number
      unit: string
      unitType: number
    }
    snow: {
      value: number
      unit: string
      unitType: number
    }
    ice: {
      value: number
      unit: string
      unitType: number
    }
  }>
}

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  visibility: number
  cloudCover: number
  dewPoint: number
  description: string
  timestamp: string
  // Azure Maps specific enhancements
  uvIndex: number
  windGust: number
  precipitationProbability: number
  airQuality?: {
    index: number
    category: string
    pollutants: Array<{
      name: string
      value: number
      unit: string
    }>
  }
}

interface ForecastData {
  date: string
  maxTemp: number
  minTemp: number
  humidity: number
  windSpeed: number
  description: string
  // Azure Maps specific enhancements
  precipitationProbability: number
  thunderstormProbability: number
  windGust: number
  uvIndex: number
  airQuality?: {
    index: number
    category: string
  }
}

class AzureWeatherService {
  private config: AzureWeatherConfig = {
    subscriptionKey: '',
    baseUrl: 'https://atlas.microsoft.com/weather'
  }

  configure(subscriptionKey: string) {
    this.config.subscriptionKey = subscriptionKey
    console.log('Azure Maps Weather Service configured')
  }

  // Get current weather conditions using Azure Maps Weather API
  async getCurrentWeather(latitude: number = 40.4168, longitude: number = -3.7038): Promise<WeatherData> {
    try {
      if (!this.config.subscriptionKey) {
        console.warn('Azure Maps subscription key not configured, using fallback')
        return this.getFallbackWeather(latitude, longitude)
      }

      const params = new URLSearchParams({
        'api-version': '1.0',
        'query': `${latitude},${longitude}`,
        'subscription-key': this.config.subscriptionKey,
        'language': 'es-ES',
        'details': 'true'
      })

      const response = await fetch(`${this.config.baseUrl}/currentConditions/json?${params}`)
      
      if (!response.ok) {
        throw new Error(`Azure Maps Weather API error: ${response.status}`)
      }

      const data: AzureCurrentWeatherResponse = await response.json()
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No weather data returned from Azure Maps')
      }

      const current = data.results[0]
      
      return {
        temperature: Math.round(current.temperature.value),
        feelsLike: Math.round(current.realFeelTemperature.value),
        humidity: current.relativeHumidity,
        pressure: Math.round(current.pressure.value),
        windSpeed: Math.round(current.wind.speed.value),
        windDirection: current.wind.direction.degrees,
        visibility: Math.round(current.visibility.value),
        cloudCover: current.cloudCover,
        dewPoint: Math.round(current.dewPoint.value),
        description: current.phrase,
        timestamp: new Date().toISOString(),
        uvIndex: current.uvIndex,
        windGust: Math.round(current.windGust?.speed?.value || current.wind.speed.value * 1.3),
        precipitationProbability: 0 // Will be enhanced with hourly data
      }
    } catch (error) {
      console.error('Error fetching Azure Maps weather data:', error)
      console.log('Falling back to Open-Meteo API')
      return this.getFallbackWeather(latitude, longitude)
    }
  }

  // Get weather forecast using Azure Maps Weather API
  async getForecast(latitude: number = 40.4168, longitude: number = -3.7038): Promise<ForecastData[]> {
    try {
      if (!this.config.subscriptionKey) {
        console.warn('Azure Maps subscription key not configured, using fallback')
        return this.getFallbackForecast(latitude, longitude)
      }

      const params = new URLSearchParams({
        'api-version': '1.0',
        'query': `${latitude},${longitude}`,
        'subscription-key': this.config.subscriptionKey,
        'language': 'es-ES',
        'duration': '5' // 5-day forecast
      })

      const response = await fetch(`${this.config.baseUrl}/forecast/daily/json?${params}`)
      
      if (!response.ok) {
        throw new Error(`Azure Maps Forecast API error: ${response.status}`)
      }

      const data: AzureForecastResponse = await response.json()
      
      return data.forecasts.map((forecast) => ({
        date: new Date(forecast.date).toISOString(),
        maxTemp: Math.round(forecast.temperature.maximum.value),
        minTemp: Math.round(forecast.temperature.minimum.value),
        humidity: 50, // Will be enhanced with detailed data
        windSpeed: Math.round(forecast.day.wind.speed.value),
        description: forecast.day.shortPhrase,
        precipitationProbability: forecast.day.precipitationProbability,
        thunderstormProbability: forecast.day.thunderstormProbability,
        windGust: Math.round(forecast.day.windGust?.speed?.value || forecast.day.wind.speed.value * 1.3),
        uvIndex: 5 // Will be enhanced with UV data
      }))
    } catch (error) {
      console.error('Error fetching Azure Maps forecast data:', error)
      console.log('Falling back to Open-Meteo API')
      return this.getFallbackForecast(latitude, longitude)
    }
  }

  // Get hourly weather data using Azure Maps Weather API
  async getHourlyData(latitude: number = 40.4168, longitude: number = -3.7038): Promise<any[]> {
    try {
      if (!this.config.subscriptionKey) {
        console.warn('Azure Maps subscription key not configured, using fallback')
        return this.getFallbackHourlyData(latitude, longitude)
      }

      const params = new URLSearchParams({
        'api-version': '1.0',
        'query': `${latitude},${longitude}`,
        'subscription-key': this.config.subscriptionKey,
        'language': 'es-ES',
        'duration': '24' // 24-hour forecast
      })

      const response = await fetch(`${this.config.baseUrl}/forecast/hourly/json?${params}`)
      
      if (!response.ok) {
        throw new Error(`Azure Maps Hourly API error: ${response.status}`)
      }

      const data: AzureHourlyForecastResponse = await response.json()
      
      return data.forecasts.map((forecast) => ({
        time: new Date(forecast.date).getHours().toString().padStart(2, '0') + ':00',
        temperature: Math.round(forecast.temperature.value),
        humidity: forecast.relativeHumidity,
        windSpeed: Math.round(forecast.wind.speed.value),
        pressure: 1013, // Will be enhanced when available
        precipitationProbability: forecast.precipitationProbability,
        cloudCover: forecast.cloudCover,
        uvIndex: forecast.uvIndex,
        windGust: Math.round(forecast.windGust?.speed?.value || forecast.wind.speed.value * 1.3)
      }))
    } catch (error) {
      console.error('Error fetching Azure Maps hourly data:', error)
      console.log('Falling back to Open-Meteo API')
      return this.getFallbackHourlyData(latitude, longitude)
    }
  }

  // Get severe weather alerts using Azure Maps Weather API
  async getSevereWeatherAlerts(latitude: number, longitude: number): Promise<Array<{
    id: string
    title: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    urgency: 'immediate' | 'expected' | 'future'
    certainty: 'observed' | 'likely' | 'possible'
    startTime: string
    endTime: string
    areas: string[]
  }>> {
    try {
      if (!this.config.subscriptionKey) {
        return []
      }

      const params = new URLSearchParams({
        'api-version': '1.0',
        'query': `${latitude},${longitude}`,
        'subscription-key': this.config.subscriptionKey,
        'language': 'es-ES'
      })

      const response = await fetch(`${this.config.baseUrl}/severe/alerts/json?${params}`)
      
      if (!response.ok) {
        console.warn(`Azure Maps Alerts API error: ${response.status}`)
        return []
      }

      const data = await response.json()
      
      return data.results?.map((alert: any) => ({
        id: alert.alertId,
        title: alert.description.localized,
        description: alert.description.english,
        severity: alert.severity.toLowerCase(),
        urgency: alert.urgency.toLowerCase(),
        certainty: alert.certainty.toLowerCase(),
        startTime: alert.startTime,
        endTime: alert.endTime,
        areas: alert.areas?.map((area: any) => area.name) || []
      })) || []
    } catch (error) {
      console.error('Error fetching severe weather alerts:', error)
      return []
    }
  }

  // Get air quality data using Azure Maps Weather API
  async getAirQuality(latitude: number, longitude: number): Promise<{
    index: number
    category: string
    pollutants: Array<{
      name: string
      value: number
      unit: string
      category: string
    }>
  } | null> {
    try {
      if (!this.config.subscriptionKey) {
        return null
      }

      const params = new URLSearchParams({
        'api-version': '1.0',
        'query': `${latitude},${longitude}`,
        'subscription-key': this.config.subscriptionKey,
        'language': 'es-ES'
      })

      const response = await fetch(`${this.config.baseUrl}/airQuality/current/json?${params}`)
      
      if (!response.ok) {
        console.warn(`Azure Maps Air Quality API error: ${response.status}`)
        return null
      }

      const data = await response.json()
      
      if (!data.results || data.results.length === 0) {
        return null
      }

      const airQuality = data.results[0]
      
      return {
        index: airQuality.globalIndex,
        category: airQuality.category,
        pollutants: airQuality.pollutants?.map((pollutant: any) => ({
          name: pollutant.name,
          value: pollutant.concentration.value,
          unit: pollutant.concentration.unit,
          category: pollutant.category
        })) || []
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error)
      return null
    }
  }

  // Fallback methods using Open-Meteo (existing implementation)
  private async getFallbackWeather(latitude: number = 40.4168, longitude: number = -3.7038): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current_weather: 'true',
        hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,surface_pressure,visibility,cloudcover',
        timezone: 'auto',
        forecast_days: '1'
      })

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`)
      }

      const data = await response.json()
      const current = data.current_weather
      const hourly = data.hourly
      
      const currentHour = new Date().getHours()
      const currentIndex = Math.min(currentHour, hourly.time.length - 1)
      
      const humidity = hourly.relativehumidity_2m[currentIndex] || 50
      const pressure = hourly.surface_pressure[currentIndex] || 1013
      const visibility = hourly.visibility[currentIndex] || 10000
      const cloudCover = hourly.cloudcover[currentIndex] || 0
      
      const dewPoint = this.calculateDewPoint(current.temperature, humidity)
      const feelsLike = this.calculateFeelsLike(current.temperature, humidity, current.windspeed)
      
      return {
        temperature: Math.round(current.temperature),
        feelsLike: feelsLike,
        humidity: Math.round(humidity),
        pressure: Math.round(pressure),
        windSpeed: Math.round(current.windspeed),
        windDirection: Math.round(current.winddirection),
        visibility: Math.round(visibility / 1000),
        cloudCover: Math.round(cloudCover),
        dewPoint: Math.round(dewPoint),
        description: 'Datos de Open-Meteo',
        timestamp: new Date().toISOString(),
        uvIndex: 5,
        windGust: Math.round(current.windspeed * 1.3),
        precipitationProbability: 0
      }
    } catch (error) {
      console.error('Error fetching fallback weather data:', error)
      // Return default values if all else fails
      return {
        temperature: 25,
        feelsLike: 26,
        humidity: 50,
        pressure: 1013,
        windSpeed: 10,
        windDirection: 180,
        visibility: 10,
        cloudCover: 30,
        dewPoint: 15,
        description: 'Datos predeterminados',
        timestamp: new Date().toISOString(),
        uvIndex: 5,
        windGust: 13,
        precipitationProbability: 0
      }
    }
  }

  private async getFallbackForecast(latitude: number = 40.4168, longitude: number = -3.7038): Promise<ForecastData[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        daily: 'temperature_2m_max,temperature_2m_min,windspeed_10m_max,relative_humidity_2m_max,weathercode',
        timezone: 'auto',
        forecast_days: '7'
      })

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      
      if (!response.ok) {
        throw new Error(`Open-Meteo Forecast API error: ${response.status}`)
      }

      const data = await response.json()
      const daily = data.daily
      
      return daily.time.map((date: string, index: number) => ({
        date: new Date(date).toISOString(),
        maxTemp: Math.round(daily.temperature_2m_max[index]),
        minTemp: Math.round(daily.temperature_2m_min[index]),
        humidity: Math.round(daily.relative_humidity_2m_max[index]),
        windSpeed: Math.round(daily.windspeed_10m_max[index]),
        description: 'Pronóstico Open-Meteo',
        precipitationProbability: 0,
        thunderstormProbability: 0,
        windGust: Math.round(daily.windspeed_10m_max[index] * 1.3),
        uvIndex: 5
      }))
    } catch (error) {
      console.error('Error fetching fallback forecast data:', error)
      // Return default forecast if all else fails
      return Array(5).fill(null).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return {
          date: date.toISOString(),
          maxTemp: 25 + i,
          minTemp: 15 + i,
          humidity: 50,
          windSpeed: 10,
          description: 'Pronóstico predeterminado',
          precipitationProbability: 0,
          thunderstormProbability: 0,
          windGust: 13,
          uvIndex: 5
        }
      })
    }
  }

  private async getFallbackHourlyData(latitude: number = 40.4168, longitude: number = -3.7038): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,surface_pressure',
        timezone: 'auto',
        forecast_days: '1'
      })

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      
      if (!response.ok) {
        throw new Error(`Open-Meteo Hourly API error: ${response.status}`)
      }

      const data = await response.json()
      const hourly = data.hourly
      
      return hourly.time.map((time: string, index: number) => ({
        time: new Date(time).getHours().toString().padStart(2, '0') + ':00',
        temperature: Math.round(hourly.temperature_2m[index]),
        humidity: Math.round(hourly.relativehumidity_2m[index]),
        windSpeed: Math.round(hourly.windspeed_10m[index]),
        pressure: Math.round(hourly.surface_pressure[index]),
        precipitationProbability: 0,
        cloudCover: 0,
        uvIndex: 5,
        windGust: Math.round(hourly.windspeed_10m[index] * 1.3)
      }))
    } catch (error) {
      console.error('Error fetching fallback hourly data:', error)
      // Return default hourly data if all else fails
      return Array(24).fill(null).map((_, i) => ({
        time: i.toString().padStart(2, '0') + ':00',
        temperature: 20 + Math.sin(i/12 * Math.PI) * 5,
        humidity: 50,
        windSpeed: 10,
        pressure: 1013,
        precipitationProbability: 0,
        cloudCover: 0,
        uvIndex: 5,
        windGust: 13
      }))
    }
  }

  private calculateDewPoint(temperature: number, humidity: number): number {
    const a = 17.27
    const b = 237.7
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100)
    return (b * alpha) / (a - alpha)
  }

  private calculateFeelsLike(temperature: number, humidity: number, windSpeed: number): number {
    if (temperature >= 26) {
      const T = temperature
      const RH = humidity
      const HI = -8.78469475556 +
                 1.61139411 * T +
                 2.33854883889 * RH +
                 -0.14611605 * T * RH +
                 -0.012308094 * T * T +
                 -0.0164248277778 * RH * RH +
                 0.002211732 * T * T * RH +
                 0.00072546 * T * RH * RH +
                 -0.000003582 * T * T * RH * RH
      return Math.round(HI)
    }
    
    if (temperature <= 10 && windSpeed > 4.8) {
      const T = temperature
      const V = windSpeed
      const WC = 13.12 + 0.6215 * T - 11.37 * Math.pow(V, 0.16) + 0.3965 * T * Math.pow(V, 0.16)
      return Math.round(WC)
    }
    
    return temperature
  }

  // Get service status
  getServiceStatus(): {
    provider: string
    configured: boolean
    capabilities: string[]
    fallbackAvailable: boolean
  } {
    return {
      provider: 'Azure Maps Weather Services (Microsoft + AccuWeather)',
      configured: !!this.config.subscriptionKey,
      capabilities: [
        'Current Weather Conditions',
        'Multi-day Forecasts',
        'Hourly Forecasts',
        'Severe Weather Alerts',
        'Air Quality Index',
        'UV Index',
        'Wind Gust Data',
        'Precipitation Probability',
        'Professional AccuWeather Data'
      ],
      fallbackAvailable: true
    }
  }
}

// Create singleton instance
export const weatherService = new AzureWeatherService()
export type { WeatherData, ForecastData, AzureWeatherConfig }