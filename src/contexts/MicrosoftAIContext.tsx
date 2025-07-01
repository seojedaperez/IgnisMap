// Microsoft AI Context - Provides AI capabilities throughout the application

import React, { createContext, useContext, useState, useEffect } from 'react';
import { microsoftAIService } from '../services/microsoftAIService';

interface MicrosoftAIContextType {
  isConfigured: boolean;
  assessFireRisk: (weatherData: any, vegetationData: any, historicalFires: any[]) => Promise<any>;
  analyzeText: (text: string, language?: string) => Promise<any>;
  analyzeImage: (imageUrl: string) => Promise<any>;
  detectAnomalies: (timeSeriesData: Array<{ timestamp: Date, value: number }>, sensitivity?: number) => Promise<any>;
  serviceStatus: {
    configured: boolean;
    textAnalytics: boolean;
    computerVision: boolean;
    anomalyDetector: boolean;
    provider: string;
  };
}

const MicrosoftAIContext = createContext<MicrosoftAIContextType | undefined>(undefined);

export const useMicrosoftAI = () => {
  const context = useContext(MicrosoftAIContext);
  if (context === undefined) {
    throw new Error('useMicrosoftAI must be used within a MicrosoftAIProvider');
  }
  return context;
};

export const MicrosoftAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serviceStatus, setServiceStatus] = useState(microsoftAIService.getServiceStatus());

  useEffect(() => {
    // Update service status periodically
    const interval = setInterval(() => {
      setServiceStatus(microsoftAIService.getServiceStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    isConfigured: serviceStatus.configured,
    assessFireRisk: microsoftAIService.assessFireRisk.bind(microsoftAIService),
    analyzeText: microsoftAIService.analyzeText.bind(microsoftAIService),
    analyzeImage: microsoftAIService.analyzeImage.bind(microsoftAIService),
    detectAnomalies: microsoftAIService.detectAnomalies.bind(microsoftAIService),
    serviceStatus
  };

  return (
    <MicrosoftAIContext.Provider value={value}>
      {children}
    </MicrosoftAIContext.Provider>
  );
};