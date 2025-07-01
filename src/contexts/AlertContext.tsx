import React, { createContext, useContext, useState, useEffect } from 'react'

interface Alert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'extreme'
  status: 'active' | 'resolved'
  location: string
  timestamp: string
  read: boolean
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  dismissAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const useAlerts = () => {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider')
  }
  return context
}

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const generateMockAlerts = (): Alert[] => {
    return [
      {
        id: '1',
        title: 'Riesgo Extremo de Incendio',
        message: 'Condiciones meteorológicas extremas detectadas. Temperatura alta, baja humedad y vientos fuertes.',
        severity: 'extreme',
        status: 'active',
        location: 'Parque Nacional de Doñana',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        read: false
      },
      {
        id: '2',
        title: 'Alerta de Viento Fuerte',
        message: 'Vientos superiores a 25 km/h detectados. Riesgo de propagación rápida de incendios.',
        severity: 'high',
        status: 'active',
        location: 'Sierra de Guadarrama',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        read: false
      },
      {
        id: '3',
        title: 'Temperatura Elevada',
        message: 'Temperatura superior a 35°C registrada. Aumento del riesgo de ignición.',
        severity: 'medium',
        status: 'active',
        location: 'Costa Brava',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        read: true
      },
      {
        id: '4',
        title: 'Condiciones Normalizadas',
        message: 'Las condiciones meteorológicas han vuelto a la normalidad. Riesgo reducido.',
        severity: 'low',
        status: 'resolved',
        location: 'Picos de Europa',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        read: true
      },
      {
        id: '5',
        title: 'Sequía Prolongada',
        message: 'Período de sequía de más de 15 días. Vegetación seca aumenta el riesgo.',
        severity: 'high',
        status: 'active',
        location: 'Andalucía Oriental',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true
      }
    ]
  }

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    }
    
    setAlerts(prev => [newAlert, ...prev])
  }

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ))
  }

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' as const } : alert
    ))
  }

  useEffect(() => {
    // Initialize with mock data
    setAlerts(generateMockAlerts())
    
    // Simulate new alerts periodically
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 30 seconds
        const severities: Alert['severity'][] = ['low', 'medium', 'high', 'extreme']
        const locations = ['Madrid Centro', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao']
        const titles = [
          'Nueva Alerta Meteorológica',
          'Cambio en Condiciones de Riesgo',
          'Actualización de Pronóstico',
          'Alerta de Temperatura'
        ]
        
        addAlert({
          title: titles[Math.floor(Math.random() * titles.length)],
          message: 'Condiciones meteorológicas actualizadas detectadas por Azure Cognitive Services.',
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: 'active',
          location: locations[Math.floor(Math.random() * locations.length)]
        })
      }
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <AlertContext.Provider value={{
      alerts,
      addAlert,
      markAsRead,
      dismissAlert
    }}>
      {children}
    </AlertContext.Provider>
  )
}