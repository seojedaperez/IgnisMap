// Azure Functions Service - Replaces generic serverless functions with Azure Functions

interface FunctionsConfig {
  baseUrl: string;
  apiKey?: string;
}

class AzureFunctionsService {
  private config: FunctionsConfig = {
    baseUrl: import.meta.env.VITE_AZURE_FUNCTIONS_URL || '',
    apiKey: import.meta.env.VITE_AZURE_FUNCTIONS_KEY || ''
  };
  private isConfigured = false;

  constructor() {
    this.isConfigured = !!this.config.baseUrl;
  }

  // Call an Azure Function
  async callFunction<T = any, U = any>(
    functionName: string,
    data?: T,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'
  ): Promise<U | null> {
    if (!this.isConfigured) {
      console.warn('Azure Functions not configured');
      return null;
    }

    try {
      const url = `${this.config.baseUrl}/api/${functionName}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      // Add function key if available
      if (this.config.apiKey) {
        headers['x-functions-key'] = this.config.apiKey;
      }

      const options: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Azure Function error: ${response.status} ${response.statusText}`);
      }
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // Return text response
      const textResponse = await response.text();
      return textResponse as unknown as U;
    } catch (error) {
      console.error(`Error calling Azure Function ${functionName}:`, error);
      return null;
    }
  }

  // Process satellite data
  async processSatelliteData(data: any): Promise<any> {
    return this.callFunction('ProcessSatelliteData', data);
  }

  // Analyze fire risk
  async analyzeFireRisk(weatherData: any, location: any): Promise<any> {
    return this.callFunction('AnalyzeFireRisk', { weatherData, location });
  }

  // Generate tactical plan
  async generateTacticalPlan(fireData: any, organizationType: string): Promise<any> {
    return this.callFunction('GenerateTacticalPlan', { fireData, organizationType });
  }

  // Send emergency alert
  async sendEmergencyAlert(alert: any): Promise<boolean> {
    const result = await this.callFunction<any, { success: boolean }>('SendEmergencyAlert', alert);
    return result?.success || false;
  }

  // Get weather forecast
  async getWeatherForecast(latitude: number, longitude: number): Promise<any> {
    return this.callFunction('GetWeatherForecast', { latitude, longitude });
  }

  // Get service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      baseUrl: this.config.baseUrl || 'Not configured',
      hasApiKey: !!this.config.apiKey
    };
  }
}

// Create and export singleton instance
export const azureFunctionsService = new AzureFunctionsService();