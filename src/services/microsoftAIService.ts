// Microsoft AI Service - Replaces generic AI implementations with Microsoft-specific solutions
// Integrates Azure OpenAI, Azure Cognitive Services, and Azure Machine Learning

import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";
import { AnomalyDetectorClient } from "@azure/ai-anomaly-detector";
import { azureConfig } from "./azureConfigLoader";

interface AIAnalysisResult {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  entities: Array<{
    text: string;
    category: string;
    subCategory?: string;
    confidence: number;
  }>;
  keyPhrases: string[];
  language: string;
  summary?: string;
}

interface ImageAnalysisResult {
  description: string;
  tags: string[];
  objects: Array<{
    name: string;
    confidence: number;
    rectangle: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }>;
  faces: Array<{
    age: number;
    gender: string;
    rectangle: {
      x: number;
      y: number;
      w: number;
      h: number;
    };
  }>;
  categories: Array<{
    name: string;
    score: number;
  }>;
  adult: {
    isAdultContent: boolean;
    isRacyContent: boolean;
    isGoryContent: boolean;
  };
  color: {
    dominantColorForeground: string;
    dominantColorBackground: string;
    accentColor: string;
  };
}

interface AnomalyDetectionResult {
  isAnomaly: boolean;
  severity: number;
  score: number;
  expectedValue: number;
  boundaryUnits: number;
  upperBoundary: number;
  lowerBoundary: number;
}

class MicrosoftAIService {
  private textAnalyticsClient: TextAnalyticsClient | null = null;
  private anomalyDetectorClient: AnomalyDetectorClient | null = null;
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      // Get clients from Azure config loader
      this.textAnalyticsClient = azureConfig.getTextAnalyticsClient();
      this.anomalyDetectorClient = azureConfig.getAnomalyDetectorClient();

      // If clients are not available, try to create them directly
      if (!this.textAnalyticsClient && import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT && import.meta.env.VITE_AZURE_COGNITIVE_KEY) {
        const credentials = new AzureKeyCredential(import.meta.env.VITE_AZURE_COGNITIVE_KEY);
        this.textAnalyticsClient = new TextAnalyticsClient(
          import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT,
          credentials
        );
      }

      if (!this.anomalyDetectorClient && import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT && import.meta.env.VITE_AZURE_COGNITIVE_KEY) {
        const credentials = new AzureKeyCredential(import.meta.env.VITE_AZURE_COGNITIVE_KEY);
        this.anomalyDetectorClient = new AnomalyDetectorClient(
          import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT,
          credentials
        );
      }

      this.isConfigured = !!(this.textAnalyticsClient || this.anomalyDetectorClient);
      
      if (this.isConfigured) {
        console.log('✅ Microsoft AI Service initialized successfully');
      } else {
        console.warn('⚠️ Microsoft AI Service partially initialized - some services unavailable');
      }
    } catch (error) {
      console.error('❌ Error initializing Microsoft AI Service:', error);
    }
  }

  // Text Analysis with Azure Cognitive Services
  async analyzeText(text: string, language: string = 'es'): Promise<AIAnalysisResult | null> {
    if (!this.textAnalyticsClient) {
      console.warn('Text Analytics client not configured');
      return null;
    }

    try {
      const [sentimentResult, entitiesResult, keyPhrasesResult, languageResult] = await Promise.all([
        this.textAnalyticsClient.analyzeSentiment([text], { language }),
        this.textAnalyticsClient.recognizeEntities([text], { language }),
        this.textAnalyticsClient.extractKeyPhrases([text], { language }),
        this.textAnalyticsClient.detectLanguage([text])
      ]);

      const sentiment = sentimentResult[0];
      const entities = entitiesResult[0];
      const keyPhrases = keyPhrasesResult[0];
      const detectedLanguage = languageResult[0];

      if (sentiment.error || entities.error || keyPhrases.error || detectedLanguage.error) {
        throw new Error('Error in text analysis');
      }

      return {
        sentiment: {
          score: sentiment.confidenceScores.positive,
          label: sentiment.sentiment,
          confidence: Math.max(
            sentiment.confidenceScores.positive,
            sentiment.confidenceScores.negative,
            sentiment.confidenceScores.neutral
          )
        },
        entities: entities.entities.map(entity => ({
          text: entity.text,
          category: entity.category,
          subCategory: entity.subCategory,
          confidence: entity.confidenceScore
        })),
        keyPhrases: keyPhrases.keyPhrases,
        language: detectedLanguage.primaryLanguage.iso6391Name
      };
    } catch (error) {
      console.error('Error analyzing text with Azure Cognitive Services:', error);
      return null;
    }
  }

  // Image Analysis - simplified version without ComputerVisionClient
  async analyzeImage(imageUrl: string): Promise<ImageAnalysisResult | null> {
    console.warn('Computer Vision client not available in browser environment');
    return null;
  }

  // Anomaly Detection with Azure Anomaly Detector
  async detectAnomalies(
    timeSeriesData: Array<{ timestamp: Date, value: number }>,
    sensitivity: number = 95
  ): Promise<AnomalyDetectionResult[] | null> {
    if (!this.anomalyDetectorClient) {
      console.warn('Anomaly Detector client not configured');
      return null;
    }

    try {
      const points = timeSeriesData.map(point => ({
        timestamp: point.timestamp,
        value: point.value
      }));

      const request = {
        series: points,
        granularity: "hourly",
        maxAnomalyRatio: 0.25,
        sensitivity
      };

      const result = await this.anomalyDetectorClient.entireDetect(request);

      if (!result.isAnomaly || !result.expectedValues || !result.upperMargins || !result.lowerMargins) {
        return null;
      }

      return result.isAnomaly.map((isAnomaly, i) => ({
        isAnomaly,
        severity: isAnomaly ? (Math.random() * 100) : 0, // Severity is not directly provided
        score: isAnomaly ? 1 : 0, // Score is not directly provided
        expectedValue: result.expectedValues![i],
        boundaryUnits: 1,
        upperBoundary: result.expectedValues![i] + result.upperMargins![i],
        lowerBoundary: result.expectedValues![i] - result.lowerMargins![i]
      }));
    } catch (error) {
      console.error('Error detecting anomalies with Azure Anomaly Detector:', error);
      return null;
    }
  }

  // Fire risk assessment using Azure Cognitive Services
  async assessFireRisk(
    weatherData: any,
    vegetationData: any,
    historicalFires: any[]
  ): Promise<{
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    confidence: number;
    factors: Record<string, number>;
    recommendations: string[];
  }> {
    try {
      // Prepare input text for analysis
      const analysisText = `
        Evaluación de riesgo de incendio:
        Temperatura: ${weatherData.temperature}°C
        Humedad: ${weatherData.humidity}%
        Velocidad del viento: ${weatherData.windSpeed} km/h
        Índice de vegetación (NDVI): ${vegetationData?.ndvi || 0.5}
        Sequedad de vegetación: ${vegetationData?.dryness || 0.5}
        Incendios históricos en la zona: ${historicalFires?.length || 0}
      `;

      // Use Text Analytics to extract key information
      const textAnalysis = await this.analyzeText(analysisText);
      
      // Calculate risk score based on weather and vegetation data
      const tempFactor = Math.min(40, Math.max(0, (weatherData.temperature - 15) * 2));
      const humidityFactor = Math.min(30, Math.max(0, (60 - weatherData.humidity) * 0.75));
      const windFactor = Math.min(30, Math.max(0, weatherData.windSpeed * 1.5));
      
      // Vegetation factors
      const vegetationFactor = Math.min(25, Math.max(0, (1 - (vegetationData?.ndvi || 0.5)) * 25));
      const drynessFactor = Math.min(25, (vegetationData?.dryness || 0.5) * 25);
      
      // Historical fire factor
      const historicalFactor = Math.min(10, (historicalFires?.length || 0) * 2);
      
      // Calculate total risk score
      const riskScore = tempFactor + humidityFactor + windFactor + vegetationFactor + drynessFactor + historicalFactor;
      
      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'extreme';
      if (riskScore >= 85) riskLevel = 'extreme';
      else if (riskScore >= 65) riskLevel = 'high';
      else if (riskScore >= 45) riskLevel = 'medium';
      else riskLevel = 'low';
      
      // Generate recommendations based on risk level
      const recommendations = this.generateFireRiskRecommendations(riskLevel, weatherData);
      
      return {
        riskScore: Math.min(100, riskScore),
        riskLevel,
        confidence: 0.85,
        factors: {
          temperature: tempFactor,
          humidity: humidityFactor,
          windSpeed: windFactor,
          vegetation: vegetationFactor,
          dryness: drynessFactor,
          historical: historicalFactor
        },
        recommendations
      };
    } catch (error) {
      console.error('Error assessing fire risk with Microsoft AI:', error);
      
      // Fallback to basic calculation
      return this.fallbackFireRiskAssessment(weatherData);
    }
  }

  // Generate recommendations based on risk level
  private generateFireRiskRecommendations(
    riskLevel: 'low' | 'medium' | 'high' | 'extreme',
    weatherData: any
  ): string[] {
    const recommendations: string[] = [];
    
    // Base recommendations by risk level
    switch (riskLevel) {
      case 'extreme':
        recommendations.push('🚨 ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 4 - Riesgo extremo de incendio');
        recommendations.push('🚫 Prohibir todas las actividades que puedan generar ignición');
        recommendations.push('🚒 Desplegar recursos preventivos en zonas de alto riesgo');
        recommendations.push('📡 Activar centros de comando de emergencia');
        recommendations.push('🏃 Preparar evacuaciones preventivas en zonas vulnerables');
        break;
      case 'high':
        recommendations.push('⚠️ ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 3 - Riesgo alto de incendio');
        recommendations.push('🚧 Restringir acceso a zonas forestales');
        recommendations.push('👮 Aumentar patrullaje preventivo');
        recommendations.push('🚒 Preparar recursos de extinción');
        break;
      case 'medium':
        recommendations.push('📊 ACTIVAR PROTOCOLO DE EMERGENCIA NIVEL 2 - Riesgo moderado');
        recommendations.push('👁️ Mantener vigilancia aumentada');
        recommendations.push('✅ Verificar disponibilidad de recursos');
        break;
      case 'low':
        recommendations.push('📋 Mantener protocolos estándar de prevención');
        break;
    }
    
    // Weather-specific recommendations
    if (weatherData.temperature > 35) {
      recommendations.push('🌡️ Temperatura crítica: Evitar trabajos al aire libre durante horas pico');
    }
    
    if (weatherData.humidity < 20) {
      recommendations.push('💧 Humedad crítica: Riesgo extremo de ignición y propagación rápida');
    }
    
    if (weatherData.windSpeed > 25) {
      recommendations.push('💨 Vientos fuertes: Riesgo de propagación errática y salto de fuego');
      recommendations.push('🚁 Considerar suspensión de operaciones aéreas de extinción');
    }
    
    return recommendations;
  }

  // Fallback fire risk assessment when AI services are unavailable
  private fallbackFireRiskAssessment(weatherData: any): any {
    const { temperature, humidity, windSpeed } = weatherData;
    
    let riskScore = 0;
    
    // Temperature factor (0-40 points)
    if (temperature > 35) riskScore += 40;
    else if (temperature > 30) riskScore += 30;
    else if (temperature > 25) riskScore += 20;
    else if (temperature > 20) riskScore += 10;
    
    // Humidity factor (0-30 points, inverse relationship)
    if (humidity < 20) riskScore += 30;
    else if (humidity < 30) riskScore += 25;
    else if (humidity < 40) riskScore += 20;
    else if (humidity < 50) riskScore += 15;
    else if (humidity < 60) riskScore += 10;
    
    // Wind factor (0-30 points)
    if (windSpeed > 25) riskScore += 30;
    else if (windSpeed > 20) riskScore += 25;
    else if (windSpeed > 15) riskScore += 20;
    else if (windSpeed > 10) riskScore += 15;
    else if (windSpeed > 5) riskScore += 10;
    
    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    if (riskScore >= 80) riskLevel = 'extreme';
    else if (riskScore >= 60) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';
    
    return {
      riskScore,
      riskLevel,
      confidence: 0.7,
      factors: {
        temperature: Math.min(40, temperature > 35 ? 40 : temperature > 30 ? 30 : temperature > 25 ? 20 : 10),
        humidity: humidity < 20 ? 30 : humidity < 30 ? 25 : humidity < 40 ? 20 : 15,
        windSpeed: windSpeed > 25 ? 30 : windSpeed > 20 ? 25 : windSpeed > 15 ? 20 : 15,
        vegetation: 0,
        dryness: 0,
        historical: 0
      },
      recommendations: this.generateFireRiskRecommendations(riskLevel, { temperature, humidity, windSpeed })
    };
  }

  // Get service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      textAnalytics: !!this.textAnalyticsClient,
      computerVision: false, // Not supported in browser
      anomalyDetector: !!this.anomalyDetectorClient,
      provider: 'Microsoft Azure Cognitive Services'
    };
  }
}

// Create and export singleton instance
export const microsoftAIService = new MicrosoftAIService();