// Azure Cosmos DB Service - Replaces generic database with Azure Cosmos DB

import { CosmosClient, Container, Database, ItemDefinition } from "@azure/cosmos";

interface CosmosConfig {
  endpoint: string;
  key: string;
  databaseId: string;
  containers: {
    organizations: string;
    monitoringZones: string;
    fireAlerts: string;
    tacticalPlans: string;
    satelliteData: string;
    weatherData: string;
    resourceAllocation: string;
    auditLog: string;
  };
}

class AzureCosmosService {
  private client: CosmosClient | null = null;
  private database: Database | null = null;
  private containers: Record<string, Container> = {};
  private config: CosmosConfig = {
    endpoint: import.meta.env.VITE_COSMOS_ENDPOINT || '',
    key: import.meta.env.VITE_COSMOS_KEY || '',
    databaseId: 'EmergencyDB',
    containers: {
      organizations: 'Organizations',
      monitoringZones: 'MonitoringZones',
      fireAlerts: 'FireAlerts',
      tacticalPlans: 'TacticalPlans',
      satelliteData: 'SatelliteData',
      weatherData: 'WeatherData',
      resourceAllocation: 'ResourceAllocation',
      auditLog: 'AuditLog'
    }
  };
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  async initialize() {
    if (!this.config.endpoint || !this.config.key) {
      console.warn('Cosmos DB not configured - missing endpoint or key');
      return;
    }

    try {
      // Initialize Cosmos client
      this.client = new CosmosClient({
        endpoint: this.config.endpoint,
        key: this.config.key
      });

      // Get database reference (don't create - requires admin permissions)
      this.database = this.client.database(this.config.databaseId);

      // Get container references
      for (const [key, containerId] of Object.entries(this.config.containers)) {
        this.containers[key] = this.database.container(containerId);
      }

      this.isConfigured = true;
      console.log('✅ Azure Cosmos DB Service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Azure Cosmos DB Service:', error);
    }
  }

  // Create a new item
  async createItem<T extends ItemDefinition>(
    containerName: keyof CosmosConfig['containers'],
    item: T
  ): Promise<T | null> {
    if (!this.isConfigured || !this.containers[containerName]) {
      console.warn(`Container ${String(containerName)} not configured`);
      return null;
    }

    try {
      const { resource } = await this.containers[containerName].items.create(item);
      return resource as T;
    } catch (error) {
      console.error(`Error creating item in ${String(containerName)}:`, error);
      return null;
    }
  }

  // Read an item by ID and partition key
  async readItem<T>(
    containerName: keyof CosmosConfig['containers'],
    id: string,
    partitionKey: string
  ): Promise<T | null> {
    if (!this.isConfigured || !this.containers[containerName]) {
      console.warn(`Container ${String(containerName)} not configured`);
      return null;
    }

    try {
      const { resource } = await this.containers[containerName].item(id, partitionKey).read();
      return resource as T;
    } catch (error) {
      console.error(`Error reading item from ${String(containerName)}:`, error);
      return null;
    }
  }

  // Update an item
  async updateItem<T extends ItemDefinition>(
    containerName: keyof CosmosConfig['containers'],
    item: T
  ): Promise<T | null> {
    if (!this.isConfigured || !this.containers[containerName]) {
      console.warn(`Container ${String(containerName)} not configured`);
      return null;
    }

    try {
      const { resource } = await this.containers[containerName].items.upsert(item);
      return resource ? (resource as unknown as T) : null;
    } catch (error) {
      console.error(`Error updating item in ${String(containerName)}:`, error);
      return null;
    }
  }

  // Delete an item
  async deleteItem(
    containerName: keyof CosmosConfig['containers'],
    id: string,
    partitionKey: string
  ): Promise<boolean> {
    if (!this.isConfigured || !this.containers[containerName]) {
      console.warn(`Container ${String(containerName)} not configured`);
      return false;
    }

    try {
      await this.containers[containerName].item(id, partitionKey).delete();
      return true;
    } catch (error) {
      console.error(`Error deleting item from ${String(containerName)}:`, error);
      return false;
    }
  }

  // Query items
  async queryItems<T>(
    containerName: keyof CosmosConfig['containers'],
    query: string,
    parameters: Array<{ name: string, value: any }> = []
  ): Promise<T[]> {
    if (!this.isConfigured || !this.containers[containerName]) {
      console.warn(`Container ${String(containerName)} not configured`);
      return [];
    }

    try {
      const querySpec = {
        query,
        parameters: parameters.map(p => ({ name: p.name, value: p.value }))
      };

      const { resources } = await this.containers[containerName].items.query(querySpec).fetchAll();
      return resources as T[];
    } catch (error) {
      console.error(`Error querying items from ${String(containerName)}:`, error);
      return [];
    }
  }

  // Get service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      endpoint: this.config.endpoint ? this.config.endpoint.replace(/\/+$/, '') : 'Not configured',
      databaseId: this.config.databaseId,
      containers: Object.keys(this.containers)
    };
  }
}

// Create and export singleton instance
export const azureCosmosService = new AzureCosmosService();