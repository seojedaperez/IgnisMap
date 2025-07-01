// Azure Storage Service - Replaces generic storage with Azure Blob and Queue Storage

import { BlobServiceClient, ContainerClient, BlockBlobClient } from "@azure/storage-blob";
import { QueueServiceClient, QueueClient } from "@azure/storage-queue";
import { azureConfig } from "./azureConfigLoader";

interface StorageConfig {
  accountName: string;
  containerName: string;
  queueName: string;
}

class AzureStorageService {
  private blobServiceClient: BlobServiceClient | null = null;
  private queueServiceClient: QueueServiceClient | null = null;
  private containerClient: ContainerClient | null = null;
  private queueClient: QueueClient | null = null;
  private config: StorageConfig = {
    accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT || '',
    containerName: 'emergency-data',
    queueName: 'emergency-queue'
  };
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      // Get clients from Azure config loader
      this.blobServiceClient = azureConfig.getBlobServiceClient();
      this.queueServiceClient = azureConfig.getQueueServiceClient();

      // If clients are not available, try to create them directly
      if (!this.blobServiceClient && this.config.accountName) {
        const blobUrl = `https://${this.config.accountName}.blob.core.windows.net`;
        this.blobServiceClient = new BlobServiceClient(blobUrl);
      }

      if (!this.queueServiceClient && this.config.accountName) {
        const queueUrl = `https://${this.config.accountName}.queue.core.windows.net`;
        this.queueServiceClient = new QueueServiceClient(queueUrl);
      }

      // Initialize container and queue clients
      if (this.blobServiceClient) {
        this.containerClient = this.blobServiceClient.getContainerClient(this.config.containerName);
        
        // Create container if it doesn't exist
        try {
          await this.containerClient.createIfNotExists();
        } catch (error) {
          console.warn('Unable to create container - may not have permissions or running in browser');
        }
      }

      if (this.queueServiceClient) {
        this.queueClient = this.queueServiceClient.getQueueClient(this.config.queueName);
        
        // Create queue if it doesn't exist
        try {
          await this.queueClient.createIfNotExists();
        } catch (error) {
          console.warn('Unable to create queue - may not have permissions or running in browser');
        }
      }

      this.isConfigured = !!(this.blobServiceClient || this.queueServiceClient);
      
      if (this.isConfigured) {
        console.log('✅ Azure Storage Service initialized successfully');
      } else {
        console.warn('⚠️ Azure Storage Service not fully configured');
      }
    } catch (error) {
      console.error('❌ Error initializing Azure Storage Service:', error);
    }
  }

  // Upload file to Azure Blob Storage
  async uploadFile(file: File, directory: string = ''): Promise<string | null> {
    if (!this.containerClient) {
      console.warn('Container client not configured');
      return null;
    }

    try {
      const timestamp = new Date().getTime();
      const blobName = directory 
        ? `${directory}/${timestamp}-${file.name}`
        : `${timestamp}-${file.name}`;
      
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.uploadData(await file.arrayBuffer(), {
        blobHTTPHeaders: {
          blobContentType: file.type
        }
      });
      
      return blockBlobClient.url;
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error);
      return null;
    }
  }

  // Download file from Azure Blob Storage
  async downloadFile(blobName: string): Promise<Blob | null> {
    if (!this.containerClient) {
      console.warn('Container client not configured');
      return null;
    }

    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const downloadResponse = await blockBlobClient.download(0);
      
      if (!downloadResponse.readableStreamBody) {
        throw new Error('No readable stream returned');
      }
      
      // Convert stream to blob
      const chunks: Uint8Array[] = [];
      const reader = (downloadResponse.readableStreamBody as any).getReader();
      
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          chunks.push(value);
        }
      }
      
      const blob = new Blob(chunks, { type: downloadResponse.contentType });
      return blob;
    } catch (error) {
      console.error('Error downloading file from Azure Blob Storage:', error);
      return null;
    }
  }

  // List files in a directory
  async listFiles(directory: string = ''): Promise<Array<{
    name: string;
    url: string;
    contentType: string;
    size: number;
    lastModified: Date;
  }>> {
    if (!this.containerClient) {
      console.warn('Container client not configured');
      return [];
    }

    try {
      const prefix = directory ? `${directory}/` : '';
      const blobs = this.containerClient.listBlobsFlat({ prefix });
      
      const files = [];
      for await (const blob of blobs) {
        const blobClient = this.containerClient.getBlobClient(blob.name);
        const properties = await blobClient.getProperties();
        
        files.push({
          name: blob.name.replace(prefix, ''),
          url: blobClient.url,
          contentType: properties.contentType || '',
          size: properties.contentLength || 0,
          lastModified: properties.lastModified || new Date()
        });
      }
      
      return files;
    } catch (error) {
      console.error('Error listing files from Azure Blob Storage:', error);
      return [];
    }
  }

  // Delete file from Azure Blob Storage
  async deleteFile(blobName: string): Promise<boolean> {
    if (!this.containerClient) {
      console.warn('Container client not configured');
      return false;
    }

    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error('Error deleting file from Azure Blob Storage:', error);
      return false;
    }
  }

  // Send message to Azure Queue Storage
  async sendQueueMessage(message: any): Promise<boolean> {
    if (!this.queueClient) {
      console.warn('Queue client not configured');
      return false;
    }

    try {
      const messageText = typeof message === 'string' 
        ? message 
        : JSON.stringify(message);
      
      const base64Message = btoa(messageText);
      await this.queueClient.sendMessage(base64Message);
      return true;
    } catch (error) {
      console.error('Error sending message to Azure Queue Storage:', error);
      return false;
    }
  }

  // Get service status
  getServiceStatus() {
    return {
      configured: this.isConfigured,
      blobStorage: !!this.blobServiceClient,
      queueStorage: !!this.queueServiceClient,
      containerName: this.config.containerName,
      queueName: this.config.queueName
    };
  }
}

// Create and export singleton instance
export const azureStorageService = new AzureStorageService();