import React, { createContext, useContext, useState } from 'react'

interface EmergencyContextType {
  isEmergencyActive: boolean
  setEmergencyActive: (active: boolean) => void
  emergencyLevel: 'low' | 'medium' | 'high' | 'critical'
  setEmergencyLevel: (level: 'low' | 'medium' | 'high' | 'critical') => void
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined)

export const useEmergency = () => {
  const context = useContext(EmergencyContext)
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider')
  }
  return context
}

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEmergencyActive, setEmergencyActive] = useState(false)
  const [emergencyLevel, setEmergencyLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low')

  return (
    <EmergencyContext.Provider value={{
      isEmergencyActive,
      setEmergencyActive,
      emergencyLevel,
      setEmergencyLevel
    }}>
      {children}
    </EmergencyContext.Provider>
  )
}