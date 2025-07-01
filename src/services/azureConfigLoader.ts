// Azure Configuration Loader
// Loads and configures all Azure services from environment variables

import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { TextAnalyticsClient } from '@azure/ai-text-analytics';
import { AnomalyDetectorClient } from '@azure/ai-anomaly-detector';
import { AzureKeyCredential } from '@azure/core-auth';

// Application Insights setup
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: import.meta.env.VITE_AZURE_APP_INSIGHTS_KEY || '',
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    disableFetchTracking: false,
    extensions: [reactPlugin]
  }
});

// Azure Maps configuration
const azureMapsKey = import.meta.env.VITE_AZURE_MAPS_KEY || '';
const azureMapsKeyEmergency = import.meta.env.VITE_AZURE_MAPS_KEY_EMERGENCY || '';

// Azure Cognitive Services configuration
const cognitiveEndpoint = import.meta.env.VITE_AZURE_COGNITIVE_ENDPOINT || '';
const cognitiveKey = import.meta.env.VITE_AZURE_COGNITIVE_KEY || '';
const cognitiveKey2 = import.meta.env.VITE_AZURE_COGNITIVE_KEY2 || '';

// Azure Storage configuration (for reference only - requires SAS tokens for browser use)
const storageAccountName = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || '';

// Azure Functions configuration
const functionsUrl = import.meta.env.VITE_AZURE_FUNCTIONS_URL || '';

// Azure Resource IDs
const subscriptionId = import.meta.env.VITE_AZURE_SUBSCRIPTION_ID || '';
const resourceGroupWildfire = import.meta.env.VITE_AZURE_RESOURCE_GROUP_WILDFIRE || '';
const resourceGroupEmergency = import.meta.env.VITE_AZURE_RESOURCE_GROUP_EMERGENCY || '';

class AzureConfigLoader {
  private initialized = false;
  private textAnalyticsClient: TextAnalyticsClient | null = null;
  private anomalyDetectorClient: AnomalyDetectorClient | null = null;

  // Initialize all Azure services
  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Application Insights
      if (import.meta.env.VITE_AZURE_APP_INSIGHTS_KEY) {
        appInsights.loadAppInsights();
        appInsights.trackPageView();
        console.log('✅ Application Insights initialized');
      }

      // Initialize Cognitive Services if configured
      if (cognitiveEndpoint && cognitiveKey) {
        try {
          const credentials = new AzureKeyCredential(cognitiveKey);
          
          this.textAnalyticsClient = new TextAnalyticsClient(
            cognitiveEndpoint,
            credentials
          );
          
          this.anomalyDetectorClient = new AnomalyDetectorClient(
            cognitiveEndpoint,
            credentials
          );
          
          console.log('✅ Azure Cognitive Services initialized');
        } catch (error) {
          console.warn('⚠️ Failed to initialize Cognitive Services clients:', error);
        }
      }

      this.initialized = true;
      console.log('✅ Azure services initialization complete');
    } catch (error) {
      console.error('❌ Error initializing Azure services:', error);
      throw error;
    }
  }

  // Get Application Insights instance
  getAppInsights() {
    return appInsights;
  }

  // Get Azure Maps key
  getAzureMapsKey() {
    return azureMapsKey || azureMapsKeyEmergency;
  }

  // Note: Azure Storage services (Blob, Queue) are not available in browser environments
  // with DefaultAzureCredential. Use SAS tokens or server-side proxy for storage operations.
  getBlobServiceClient() {
    console.warn('Azure Blob Storage requires SAS tokens or server-side authentication in browser environments');
    return null;
  }

  getQueueServiceClient() {
    console.warn('Azure Queue Storage requires SAS tokens or server-side authentication in browser environments');
    return null;
  }

  // Get Text Analytics Client
  getTextAnalyticsClient() {
    return this.textAnalyticsClient;
  }

  // Get Anomaly Detector Client
  getAnomalyDetectorClient() {
    return this.anomalyDetectorClient;
  }

  // Get Computer Vision Client - removed as it's not compatible with browser environment
  getComputerVisionClient() {
    console.warn('ComputerVisionClient is not supported in browser environments');
    return null;
  }

  // Get Azure Functions URL
  getFunctionsUrl() {
    return functionsUrl;
  }

  // Get storage account name (for SAS token generation on server-side)
  getStorageAccountName() {
    return storageAccountName;
  }

  // Get configuration status
  getConfigStatus() {
    return {
      appInsights: !!import.meta.env.VITE_AZURE_APP_INSIGHTS_KEY,
      azureMaps: !!azureMapsKey,
      cognitiveServices: !!(cognitiveEndpoint && cognitiveKey),
      storage: !!storageAccountName, // Available for SAS token usage
      functions: !!functionsUrl,
      initialized: this.initialized
    };
  }
}

// Create singleton instance
export const azureConfig = new AzureConfigLoader();

// Export for use in components
export { appInsights, reactPlugin };