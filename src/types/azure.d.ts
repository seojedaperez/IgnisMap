declare module '@azure/ai-anomaly-detector' {
  export class AnomalyDetectorClient {
    constructor(endpoint: string, credential: any);
    detectEntireSeriesAnomaly(body: any): Promise<any>;
    detectLastPointAnomaly(body: any): Promise<any>;
    detectChangePoint(body: any): Promise<any>;
  }
}