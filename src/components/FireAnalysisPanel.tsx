import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Flame, Wind, Thermometer, Eye, TrendingUp, MapPin, Target } from 'lucide-react'

interface FireAnalysisPanelProps {
  alert: any
}

const FireAnalysisPanel: React.FC<FireAnalysisPanelProps> = ({ alert }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'spread' | 'impact'>('overview')
  const { analysis, fireData } = alert

  // Data for magnitude breakdown chart
  const magnitudeData = [
    { name: 'Satellite Brightness', value: Math.min(40, (fireData.brightness - 300) / 10), max: 40 },
    { name: 'Fire Size', value: Math.min(30, fireData.size * 5), max: 30 },
    { name: 'Weather Conditions', value: 15, max: 20 },
    { name: 'Vegetation Dryness', value: 8, max: 10 }
  ]

  // Data for danger breakdown chart
  const dangerData = [
    { name: 'Population', value: 35, max: 40 },
    { name: 'Infrastructure', value: 25, max: 30 },
    { name: 'Economic Value', value: 18, max: 20 },
    { name: 'Environmental Value', value: 7, max: 10 }
  ]

  // Data for spread prediction
  const spreadData = [
    { time: '1h', area: 5 },
    { time: '6h', area: 25 },
    { time: '12h', area: 65 },
    { time: '24h', area: analysis.spreadPrediction.area24h },
    { time: '48h', area: analysis.spreadPrediction.area72h * 0.7 },
    { time: '72h', area: analysis.spreadPrediction.area72h }
  ]

  // Data for impact analysis
  const impactData = [
    { name: 'Residential', value: 35, color: '#ef4444' },
    { name: 'Agricultural', value: 25, color: '#f59e0b' },
    { name: 'Forest', value: 30, color: '#10b981' },
    { name: 'Industrial', value: 10, color: '#6366f1' }
  ]

  const getMagnitudeLevel = (score: number) => {
    if (score >= 80) return { level: 'Extreme', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (score >= 60) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  const getDangerLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-600', bgColor: 'bg-red-100' }
    if (score >= 60) return { level: 'High', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { level: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' }
  }

  const magnitude = getMagnitudeLevel(analysis.magnitudeScore)
  const danger = getDangerLevel(analysis.dangerScore)

  const tabs = [
    { id: 'overview', label: 'Summary', icon: Flame },
    { id: 'spread', label: 'Spread', icon: Wind },
    { id: 'impact', label: 'Impact', icon: Target }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
        <Flame className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
        Comprehensive Fire Analysis - {alert.zone.name}
      </h2>

      {/* Navigation Tabs - Mobile version */}
      <div className="border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 md:space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1 md:gap-2 py-2 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className={`p-3 md:p-4 rounded-lg border ${magnitude.bgColor}`}>
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Flame className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                <span className="font-semibold text-sm md:text-base text-gray-900">Magnitude</span>
              </div>
              <div className={`text-xl md:text-2xl font-bold ${magnitude.color}`}>
                {analysis.magnitudeScore.toFixed(2)}/100
              </div>
              <div className={`text-xs md:text-sm font-medium ${magnitude.color}`}>
                {magnitude.level}
              </div>
            </div>

            <div className={`p-3 md:p-4 rounded-lg border ${danger.bgColor}`}>
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                <span className="font-semibold text-sm md:text-base text-gray-900">Danger</span>
              </div>
              <div className={`text-xl md:text-2xl font-bold ${danger.color}`}>
                {analysis.dangerScore.toFixed(2)}/100
              </div>
              <div className={`text-xs md:text-sm font-medium ${danger.color}`}>
                {danger.level}
              </div>
            </div>

            <div className="p-3 md:p-4 rounded-lg border bg-blue-100">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Wind className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <span className="font-semibold text-sm md:text-base text-gray-900">Speed</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-600">
                {analysis.spreadPrediction.speed.toFixed(2)} km/h
              </div>
              <div className="text-xs md:text-sm font-medium text-blue-600">
                Direction: {analysis.spreadPrediction.direction.toFixed(2)}°
              </div>
            </div>

            <div className="p-3 md:p-4 rounded-lg border bg-purple-100">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="font-semibold text-sm md:text-base text-gray-900">Confidence</span>
              </div>
              <div className="text-xl md:text-2xl font-bold text-purple-600">
                {Math.round(analysis.dataQuality.overallConfidence * 100)}%
              </div>
              <div className="text-xs md:text-sm font-medium text-purple-600">
                Azure AI
              </div>
            </div>
          </div>

          {/* Fire Location */}
          <div className="p-3 md:p-4 border rounded-lg bg-red-50 mb-4 md:mb-6">
            <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
              Fire Location
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <span className="text-red-800 font-medium text-sm">Latitude:</span>
                <p className="text-red-700 text-sm">{fireData.location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <span className="text-red-800 font-medium text-sm">Longitude:</span>
                <p className="text-red-700 text-sm">{fireData.location.longitude.toFixed(6)}</p>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Charts - Responsive height */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Magnitude Breakdown */}
            <div className="p-3 md:p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Fire Magnitude Breakdown</h3>
              <div style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={magnitudeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#dc2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs md:text-sm text-gray-600">
                <strong>Total:</strong> {analysis.magnitudeScore.toFixed(2)}/100 points
              </div>
            </div>

            {/* Danger Breakdown */}
            <div className="p-3 md:p-4 border rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Danger Level Breakdown</h3>
              <div style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dangerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ea580c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-xs md:text-sm text-gray-600">
                <strong>Total:</strong> {analysis.dangerScore.toFixed(2)}/100 points
              </div>
            </div>
          </div>

          {/* Satellite Data Quality */}
          <div className="p-3 md:p-4 border rounded-lg bg-blue-50">
            <h3 className="font-semibold text-blue-900 mb-2 md:mb-3 text-sm md:text-base">🛰️ Satellite Data Quality</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-blue-600">
                  {Math.round(analysis.dataQuality.satelliteData * 100)}%
                </div>
                <div className="text-xs md:text-sm text-blue-700">Satellite Data</div>
                <div className="text-xs text-blue-600">VIIRS + MODIS</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-blue-600">
                  {Math.round(analysis.dataQuality.weatherData * 100)}%
                </div>
                <div className="text-xs md:text-sm text-blue-700">Weather Data</div>
                <div className="text-xs text-blue-600">Azure Weather</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-blue-600">
                  {Math.round(analysis.dataQuality.infrastructureData * 100)}%
                </div>
                <div className="text-xs md:text-sm text-blue-700">Infrastructure</div>
                <div className="text-xs text-blue-600">OpenStreetMap</div>
              </div>
              <div className="text-center">
                <div className="text-base md:text-lg font-bold text-blue-600">
                  {Math.round(analysis.dataQuality.overallConfidence * 100)}%
                </div>
                <div className="text-xs md:text-sm text-blue-700">Total Confidence</div>
                <div className="text-xs text-blue-600">Azure AI</div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'spread' && (
        <div className="space-y-4 md:space-y-6">
          {/* Spread Prediction */}
          <div className="p-3 md:p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Spread Prediction (Machine Learning)</h3>
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spreadData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis label={{ value: 'Area (ha)', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value} ha`, 'Affected Area']} />
                  <Bar dataKey="area" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-xs md:text-sm text-gray-600">
              <strong>Prediction based on:</strong> Rothermel Model + Azure Machine Learning + Weather data
            </div>
          </div>

          {/* Spread Factors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <Wind className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Wind Factors</h3>
              </div>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Speed:</span>
                  <span className="font-medium">{analysis.spreadPrediction.speed.toFixed(2)} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction:</span>
                  <span className="font-medium">{analysis.spreadPrediction.direction.toFixed(2)}° ({getWindDirection(analysis.spreadPrediction.direction)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gusts:</span>
                  <span className="font-medium">{(analysis.spreadPrediction.speed * 1.3).toFixed(2)} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stability:</span>
                  <span className="font-medium">Unstable</span>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <Thermometer className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Environmental Factors</h3>
              </div>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-medium">32°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vegetation dryness:</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">NDVI Index:</span>
                  <span className="font-medium">0.32</span>
                </div>
              </div>
            </div>

            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Topographic Factors</h3>
              </div>
              <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Slope:</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aspect:</span>
                  <span className="font-medium">South</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elevation:</span>
                  <span className="font-medium">450m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accessibility:</span>
                  <span className="font-medium">Moderate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Spread Points */}
          <div className="p-3 md:p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Critical Spread Points</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-red-800 text-sm">Fire Head</h4>
                  <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded-full">CRITICAL</span>
                </div>
                <p className="text-xs md:text-sm text-red-700">
                  Main advance in {getWindDirection(analysis.spreadPrediction.direction)} direction at {analysis.spreadPrediction.speed.toFixed(2)} km/h. 
                  Maximum priority for containment.
                </p>
              </div>
              
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-orange-800 text-sm">Right Flank</h4>
                  <span className="text-xs font-medium bg-orange-100 text-orange-800 px-2 py-1 rounded-full">HIGH</span>
                </div>
                <p className="text-xs md:text-sm text-orange-700">
                  Lateral spread with potential for opening. Risk of affecting residential area in 3-4 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'impact' && (
        <div className="space-y-4 md:space-y-6">
          {/* Impact Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Population</h3>
              </div>
              <div className="text-xl md:text-2xl font-bold text-red-600">2,450</div>
              <div className="text-xs md:text-sm text-gray-600">People at risk</div>
            </div>
            
            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Structures</h3>
              </div>
              <div className="text-xl md:text-2xl font-bold text-orange-600">185</div>
              <div className="text-xs md:text-sm text-gray-600">Buildings threatened</div>
            </div>
            
            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Area</h3>
              </div>
              <div className="text-xl md:text-2xl font-bold text-green-600">{analysis.spreadPrediction.area72h.toFixed(2)}</div>
              <div className="text-xs md:text-sm text-gray-600">Potential hectares</div>
            </div>
            
            <div className="p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Infrastructure</h3>
              </div>
              <div className="text-xl md:text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs md:text-sm text-gray-600">Critical facilities</div>
            </div>
          </div>

          {/* Land Use Impact */}
          <div className="p-3 md:p-4 border rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Land Use Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={impactData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-2 md:space-y-3">
                <div className="p-2 md:p-3 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 text-sm">Residential Area</h4>
                  <p className="text-xs md:text-sm text-red-700 mt-1">
                    35% of affected area. Includes 3 urban developments with approximately 2,450 residents.
                  </p>
                </div>
                
                <div className="p-2 md:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 text-sm">Agricultural Area</h4>
                  <p className="text-xs md:text-sm text-yellow-700 mt-1">
                    25% of affected area. Dryland and irrigated crops with estimated economic value of €1.2M.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Azure Services Used */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg text-xs md:text-sm">
        <h4 className="font-semibold text-gray-900 mb-2 text-xs md:text-sm">🚀 Azure Services Used:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 text-gray-700">
          <div>✓ Azure ML</div>
          <div>✓ Cognitive Services</div>
          <div>✓ Azure Maps</div>
          <div>✓ Azure Functions</div>
        </div>
      </div>
    </div>
  )
}

// Helper function to convert degrees to cardinal direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return directions[Math.round(degrees / 45) % 8]
}

export default FireAnalysisPanel