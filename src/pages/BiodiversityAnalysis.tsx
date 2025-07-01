import React, { useState, useEffect } from 'react';
import { Leaf, AlertTriangle, MapPin, Download, Share2, RefreshCw } from 'lucide-react';
import BiodiversityDataDisplay from '../components/BiodiversityDataDisplay';
import { microsoftBiodiversityService, BiodiversityAssessment } from '../services/microsoftBiodiversityService';
import { appInsights } from '../services/azureConfigLoader';
import MicrosoftTechBadge from '../components/MicrosoftTechBadge';
import Layout from '../components/Layout';

const BiodiversityAnalysis: React.FC = () => {
  const [location, setLocation] = useState({ latitude: 40.4168, longitude: -3.7038 }); // Default: Madrid
  const [biodiversityData, setBiodiversityData] = useState<BiodiversityAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(10); // km

  useEffect(() => {
    loadBiodiversityData();
  }, [location, searchRadius]);

  const loadBiodiversityData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      appInsights.trackEvent({ name: 'BiodiversityAnalysis.Started', properties: { location: `${location.latitude},${location.longitude}` } });
      
      const data = await microsoftBiodiversityService.getBiodiversityAssessment(location, searchRadius);
      setBiodiversityData(data);
      
      appInsights.trackEvent({ 
        name: 'BiodiversityAnalysis.Completed', 
        properties: { 
          speciesCount: data.species.count.toString(),
          fireRisk: data.fireRisk.overall.toString(),
          conservationValue: data.conservationValue.toString()
        } 
      });
    } catch (error) {
      console.error('Error loading biodiversity data:', error);
      setError('Error loading biodiversity data. Please try again.');
      
      appInsights.trackException({ exception: error as Error });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lat = parseFloat(formData.get('latitude') as string);
    const lon = parseFloat(formData.get('longitude') as string);
    
    if (!isNaN(lat) && !isNaN(lon)) {
      setLocation({ latitude: lat, longitude: lon });
    }
  };

  const handleRefresh = () => {
    loadBiodiversityData();
  };

  const handleExport = () => {
    if (!biodiversityData) return;
    
    const dataStr = JSON.stringify(biodiversityData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `biodiversity-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    appInsights.trackEvent({ name: 'BiodiversityData.Exported' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Biodiversity Analysis</h1>
            <p className="text-gray-600">Satellite data from Microsoft Planetary Computer</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={handleExport}
              disabled={!biodiversityData || loading}
              className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Location Form */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                Location
              </h3>
              
              <form onSubmit={handleLocationChange} className="space-y-3">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    id="latitude"
                    name="latitude"
                    defaultValue={location.latitude.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    id="longitude"
                    name="longitude"
                    defaultValue={location.longitude.toString()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                    Search radius (km)
                  </label>
                  <input
                    type="range"
                    id="radius"
                    name="radius"
                    min="1"
                    max="50"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 km</span>
                    <span>{searchRadius} km</span>
                    <span>50 km</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Microsoft Tech Badge */}
            <MicrosoftTechBadge />
            
            {/* Data Source Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Data Sources
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span><strong>Microsoft Planetary Computer:</strong> Satellite vegetation data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span><strong>Microsoft Biodiversity Data Service:</strong> Species data</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span><strong>Azure Cognitive Services:</strong> Image analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span><strong>Sentinel-2:</strong> Vegetation indices (NDVI, EVI)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span><strong>Landsat-8:</strong> Historical fire analysis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="card flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading biodiversity data...</p>
                  <p className="text-sm text-gray-500 mt-2">Analyzing satellite images from Microsoft Planetary Computer</p>
                </div>
              </div>
            ) : error ? (
              <div className="card p-6 bg-red-50 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">Error</h3>
                </div>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            ) : biodiversityData ? (
              <BiodiversityDataDisplay biodiversityData={biodiversityData} />
            ) : (
              <div className="card p-6">
                <p className="text-gray-600 text-center">No data available. Please start a search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BiodiversityAnalysis;