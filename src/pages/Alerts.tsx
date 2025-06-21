import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Filter, Bell } from 'lucide-react'
import { useAlerts } from '../contexts/AlertContext'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const Alerts: React.FC = () => {
  const { alerts, markAsRead, dismissAlert } = useAlerts()
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'extreme'>('all')

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || alert.status === filter
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter
    return statusMatch && severityMatch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'extreme': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
      case 'high':
        return <AlertTriangle className="h-5 w-5" />
      case 'medium':
        return <Clock className="h-5 w-5" />
      case 'low':
        return <Bell className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centro de Alertas</h1>
          <p className="text-gray-600">Notificaciones y alertas de Azure Cognitive Services</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
          >
            <option value="all">Todas</option>
            <option value="active">Activas</option>
            <option value="resolved">Resueltas</option>
          </select>
          
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
          >
            <option value="all">Todas las severidades</option>
            <option value="extreme">Extrema</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Riesgo Alto</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.severity === 'high' || a.severity === 'extreme').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resueltas</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sin Leer</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => !a.read).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="card">
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay alertas que coincidan con los filtros seleccionados</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-colors ${
                  alert.read ? 'bg-gray-50 border-gray-200' : 'bg-white border-fire-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.title}
                        </h3>
                        {!alert.read && (
                          <span className="w-2 h-2 bg-fire-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{alert.location}</span>
                        <span>•</span>
                        <span>
                          {format(new Date(alert.timestamp), 'dd MMM yyyy, HH:mm', { locale: es })}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="px-3 py-1 text-sm text-fire-600 hover:text-fire-700 font-medium"
                      >
                        Marcar como leída
                      </button>
                    )}
                    
                    {alert.status === 'active' && (
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                      >
                        Resolver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Alerts