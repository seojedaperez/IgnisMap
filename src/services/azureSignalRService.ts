// Azure SignalR Service - Replaces generic real-time communication with Microsoft SignalR

import * as signalR from "@microsoft/signalr";
import { appInsights } from "./azureConfigLoader";

interface SignalRConfig {
  hubUrl: string;
  hubName: string;
}

class AzureSignalRService {
  private connection: signalR.HubConnection | null = null;
  private config: SignalRConfig = {
    hubUrl: import.meta.env.VITE_AZURE_FUNCTIONS_URL || '',
    hubName: 'emergencyHub'
  };
  private isConfigured = false;
  private eventHandlers: Record<string, Array<(data: any) => void>> = {};
  private connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error' = 'disconnected';

  constructor() {
    if (this.config.hubUrl) {
      this.isConfigured = true;
    }
  }

  // Initialize SignalR connection
  async connect(): Promise<boolean> {
    if (!this.isConfigured || !this.config.hubUrl) {
      console.warn('SignalR not configured - missing hub URL');
      return false;
    }

    try {
      // Build the full hub URL
      const hubUrl = `${this.config.hubUrl}/api/${this.config.hubName}`;
      
      // Create the connection
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            // Exponential backoff with max of 30 seconds
            return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
          }
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up connection state change handlers
      this.connection.onreconnecting(() => {
        this.connectionState = 'reconnecting';
        console.log('Reconnecting to SignalR hub...');
        appInsights.trackEvent({ name: 'SignalR.Reconnecting' });
      });

      this.connection.onreconnected(() => {
        this.connectionState = 'connected';
        console.log('Reconnected to SignalR hub');
        appInsights.trackEvent({ name: 'SignalR.Reconnected' });
      });

      this.connection.onclose(() => {
        this.connectionState = 'disconnected';
        console.log('Disconnected from SignalR hub');
        appInsights.trackEvent({ name: 'SignalR.Disconnected' });
      });

      // Start the connection
      this.connectionState = 'connecting';
      await this.connection.start();
      this.connectionState = 'connected';
      console.log('✅ Connected to Azure SignalR hub');
      appInsights.trackEvent({ name: 'SignalR.Connected' });

      // Register event handlers
      this.registerEventHandlers();

      return true;
    } catch (error) {
      this.connectionState = 'error';
      console.error('❌ Error connecting to Azure SignalR hub:', error);
      appInsights.trackException({ exception: error as Error });
      return false;
    }
  }

  // Disconnect from SignalR hub
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.connectionState = 'disconnected';
        console.log('Disconnected from Azure SignalR hub');
      } catch (error) {
        console.error('Error disconnecting from Azure SignalR hub:', error);
      }
    }
  }

  // Register event handlers with the connection
  private registerEventHandlers(): void {
    if (!this.connection) return;

    // Register all event handlers
    Object.keys(this.eventHandlers).forEach(eventName => {
      this.connection!.on(eventName, (data: any) => {
        this.eventHandlers[eventName].forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error(`Error in SignalR event handler for ${eventName}:`, error);
          }
        });
      });
    });

    // Register default events
    this.connection.on('EmergencyAlert', (data: any) => {
      console.log('Emergency alert received:', data);
      appInsights.trackEvent({ 
        name: 'EmergencyAlert.Received',
        properties: {
          alertType: data.type,
          severity: data.severity,
          location: `${data.latitude},${data.longitude}`
        }
      });
    });

    this.connection.on('StatusUpdate', (data: any) => {
      console.log('Status update received:', data);
    });
  }

  // Subscribe to an event
  on(eventName: string, callback: (data: any) => void): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    
    this.eventHandlers[eventName].push(callback);
    
    // If already connected, register the handler immediately
    if (this.connection && this.connectionState === 'connected') {
      this.connection.on(eventName, callback);
    }
  }

  // Unsubscribe from an event
  off(eventName: string, callback?: (data: any) => void): void {
    if (!this.eventHandlers[eventName]) return;
    
    if (callback) {
      // Remove specific callback
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(
        handler => handler !== callback
      );
    } else {
      // Remove all callbacks for this event
      delete this.eventHandlers[eventName];
    }
    
    // If connected, remove the handler
    if (this.connection && this.connectionState === 'connected' && callback) {
      this.connection.off(eventName, callback);
    }
  }

  // Send a message to the hub
  async send(methodName: string, ...args: any[]): Promise<boolean> {
    if (!this.connection || this.connectionState !== 'connected') {
      console.warn('Cannot send message - not connected to SignalR hub');
      return false;
    }

    try {
      await this.connection.invoke(methodName, ...args);
      return true;
    } catch (error) {
      console.error(`Error sending message to SignalR hub (${methodName}):`, error);
      return false;
    }
  }

  // Get connection state
  getConnectionState(): string {
    return this.connectionState;
  }

  // Get service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      connectionState: this.connectionState,
      hubUrl: this.config.hubUrl ? `${this.config.hubUrl}/api/${this.config.hubName}` : 'Not configured'
    };
  }
}

// Create and export singleton instance
export const azureSignalRService = new AzureSignalRService();