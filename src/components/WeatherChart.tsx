import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useWeather } from '../contexts/WeatherContext'

const WeatherChart: React.FC = () => {
  const { hourlyData, loading } = useWeather()

  if (loading || hourlyData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Take only the next 24 hours of data
  const chartData = hourlyData.slice(0, 24)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Hora: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                entry.name === 'Temperatura' ? '°C' : 
                entry.name === 'Humedad' ? '%' : 
                entry.name === 'Viento' ? ' km/h' : ' hPa'
              }`}
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
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6b7280' }}
          />
          <Tooltip content={<CustomTooltip />} />
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
            dataKey="windSpeed" 
            stroke="#6b7280" 
            strokeWidth={2}
            name="Viento"
            dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="pressure" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Presión"
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default WeatherChart