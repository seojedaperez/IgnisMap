import React, { useEffect, useState } from 'react'
import { AlertTriangle, Flame } from 'lucide-react'
import { useWeather } from '../contexts/WeatherContext'
import { azureService, FireRiskPrediction } from '../services/azureService'

const RiskMeter: React.FC = () => {
  const { currentWeather, loading: weatherLoading } = useWeather()
  const [riskPrediction, setRiskPrediction] = useState<FireRiskPrediction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateRisk = async () => {
      if (!currentWeather) return
      
      setLoading(true)
      try {
        const prediction = await azureService.predictFireRisk(currentWeather)
        setRiskPrediction(prediction)
      } catch (error) {
        console.error('Error calculating fire risk:', error)
      } finally {
        setLoading(false)
      }
    }

    if (currentWeather && !weatherLoading) {
      calculateRisk()
    }
  }, [currentWeather, weatherLoading])

  if (loading || weatherLoading || !riskPrediction) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return { level: 'Extreme', color: 'text-ember-coral', bgColor: 'bg-ember-coral' }
    if (risk >= 60) return { level: 'High', color: 'text-ember-burgundy', bgColor: 'bg-ember-burgundy' }
    if (risk >= 40) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-500' }
  }

  const riskInfo = getRiskLevel(riskPrediction.riskScore)

  return (
    <div className="space-y-6">
      {/* Risk Gauge */}
      <div className="flex items-center justify-center">
        <div className="relative w-36 h-36 sm:w-48 sm:h-48">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${riskPrediction.riskScore * 2.51} 251`}
              className={riskInfo.color}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Flame className={`h-6 w-6 sm:h-8 sm:w-8 ${riskInfo.color} fire-icon mb-1 sm:mb-2`} />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">{Math.round(riskPrediction.riskScore)}%</span>
            <span className={`text-xs sm:text-sm font-medium ${riskInfo.color}`}>
              {riskInfo.level}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="font-medium text-orange-800 text-sm">Temperature</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">{currentWeather?.temperature}°C</p>
          <p className="text-xs sm:text-sm text-orange-700">
            Factor: {riskPrediction.factors.temperature}/40
          </p>
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium text-blue-800 text-sm">Humidity</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{currentWeather?.humidity}%</p>
          <p className="text-xs sm:text-sm text-blue-700">
            Factor: {riskPrediction.factors.humidity}/30
          </p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="font-medium text-gray-800 text-sm">Wind</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-600">{currentWeather?.windSpeed} km/h</p>
          <p className="text-xs sm:text-sm text-gray-700">
            Factor: {riskPrediction.factors.windSpeed}/30
          </p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-ember-coral" />
          Risk Assessment
          <span className="text-xs sm:text-sm font-normal text-gray-600">
            (Confidence: {Math.round(riskPrediction.confidence * 100)}%)
          </span>
        </h3>
        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
          {riskPrediction.recommendations.map((recommendation, index) => (
            <p key={index}>• {recommendation}</p>
          ))}
        </div>
      </div>

      {/* Data Source */}
      <div className="text-center text-xs text-gray-500">
        Weather data: Open-Meteo API | 
        Risk analysis: {azureService.getStatus().configured ? 'Azure Cognitive Services' : 'Local algorithm'}
      </div>
    </div>
  )
}

export default RiskMeter