import React from 'react'
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { useAlerts } from '../contexts/AlertContext'
import { format } from 'date-fns'
import { en } from 'date-fns/locale'

const AlertsList: React.FC = () => {
  const { alerts } = useAlerts()
  
  // Show only the 5 most recent alerts
  const recentAlerts = alerts.slice(0, 5)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-ember-coral" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'border-ember-coral bg-ember-100'
      case 'high': return 'border-ember-peach bg-ember-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Alerts</h3>
        <span className="text-xs sm:text-sm text-gray-500">
          {alerts.filter(a => !a.read).length} unread
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {recentAlerts.length === 0 ? (
          <p className="text-gray-500 text-xs sm:text-sm text-center py-4">
            No recent alerts
          </p>
        ) : (
          recentAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-2 sm:p-3 rounded-lg border transition-colors ${getSeverityColor(alert.severity)} ${
                !alert.read ? 'ring-1 ring-ember-200' : ''
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {alert.title}
                    </h4>
                    {!alert.read && (
                      <span className="w-1.5 h-1.5 bg-ember-coral rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate text-[10px] sm:text-xs">{alert.location}</span>
                    <span className="flex-shrink-0 ml-1 sm:ml-2 text-[10px] sm:text-xs">
                      {format(new Date(alert.timestamp), 'HH:mm', { locale: en })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length > 5 && (
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
          <button className="w-full text-xs sm:text-sm text-ember-coral hover:text-ember-burgundy font-medium">
            View all alerts ({alerts.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default AlertsList