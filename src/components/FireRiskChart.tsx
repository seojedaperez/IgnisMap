import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import { azureService } from '../services/azureService'

interface RiskChartData {
  date: string
  risk: number
  temperature: number
  humidity: number
  wind: number
}

const FireRiskChart: React.FC = () => {
  const [chartData, setChartData] = useState<RiskChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateHistoricalData = async () => {
      setLoading(true)
      try {
        const data: RiskChartData[] = []
        
        // Generate data for the last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i)
          
          // For demo purposes, we'll generate realistic weather patterns
          // In a real app, this would come from historical weather APIs
          const baseTemp = 25 + Math.sin(i / 7 * Math.PI) * 10 + Math.random() * 5
          const baseHumidity = 50 - Math.sin(i / 7 * Math.PI) * 20 + Math.random() * 10
          const baseWind = 10 + Math.random() * 15
          
          const temperature = Math.round(baseTemp)
          const humidity = Math.round(Math.max(20, Math.min(80, baseHumidity)))
          const wind = Math.round(baseWind)
          
          // Calculate risk using our service
          const mockWeatherData = { temperature, humidity, windSpeed: wind }
          const riskPrediction = await azureService.predictFireRisk(mockWeatherData)
          
          data.push({
            date: format(date, 'dd/MM'),
            risk: Math.round(riskPrediction.riskScore),
            temperature,
            humidity,
            wind
          })
        }
        
        setChartData(data)
      } catch (error) {
        console.error('Error generating risk chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    generateHistoricalData()
  }, [])

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Fecha: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name === 'Riesgo' ? '%' : 
                entry.name === 'Temperatura' ? '°C' : 
                entry.name === 'Humedad' ? '%' : ' km/h'}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#dc2626" 
            strokeWidth={3}
            name="Riesgo"
            dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#f97316" 
            strokeWidth={2}
            name="Temperatura"
            dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="humidity" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Humedad"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="wind" 
            stroke="#6b7280" 
            strokeWidth={2}
            name="Viento"
            dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FireRiskChart