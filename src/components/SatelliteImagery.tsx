import React, { useEffect, useState } from 'react'
import { Satellite, Calendar, Cloud, Leaf } from 'lucide-react'
import { planetaryComputerService, SatelliteImagery as SatelliteImageryType, VegetationIndex } from '../services/planetaryComputerService'
import { microsoftBiodiversityService } from '../services/microsoftBiodiversityService'
import { format } from 'date-fns'
import { en } from 'date-fns/locale'

interface SatelliteImageryProps {
  location: { latitude: number, longitude: number }
  className?: string
}

const SatelliteImagery: React.FC<SatelliteImageryProps> = ({ location, className = '' }) => {
  const [imagery, setImagery] = useState<SatelliteImageryType[]>([])
  const [vegetationIndex, setVegetationIndex] = useState<VegetationIndex | null>(null)
  const [biodiversityData, setBiodiversityData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<SatelliteImageryType | null>(null)

  useEffect(() => {
    const fetchSatelliteData = async () => {
      setLoading(true)
      try {
        const bbox = [
          location.longitude - 0.1,
          location.latitude - 0.1,
          location.longitude + 0.1,
          location.latitude + 0.1
        ]

        const endDate = new Date()
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

        const [satelliteImages, vegIndex, biodiversity] = await Promise.all([
          planetaryComputerService.searchSatelliteImagery(
            bbox,
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
          ),
          planetaryComputerService.calculateVegetationIndices(bbox, endDate.toISOString()),
          microsoftBiodiversityService.getBiodiversityAssessment(location, 5)
        ])

        setImagery(satelliteImages)
        setVegetationIndex(vegIndex)
        setBiodiversityData(biodiversity)
        
        if (satelliteImages.length > 0) {
          setSelectedImage(satelliteImages[0])
        }
      } catch (error) {
        console.error('Error fetching satellite data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSatelliteData()
  }, [location])

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Biodiversity Data from Microsoft */}
      {biodiversityData && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Biodiversity in Fire Zone</h3>
            <span className="text-sm text-gray-500">
              Confidence: {Math.round(biodiversityData.dataQuality.overallConfidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">Species</h4>
              <p className="text-2xl font-bold text-green-600">
                {biodiversityData.species.count}
              </p>
              <p className="text-xs text-green-700">
                {biodiversityData.species.endangered} endangered
              </p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">NDVI</h4>
              <p className="text-2xl font-bold text-blue-600">
                {biodiversityData.vegetation.ndvi.toFixed(2)}
              </p>
              <p className="text-xs text-blue-700">Vegetation Index</p>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-1">Fire Risk</h4>
              <p className="text-2xl font-bold text-orange-600">
                {biodiversityData.fireRisk.overall.toFixed(0)}
              </p>
              <p className="text-xs text-orange-700">
                {biodiversityData.fireRisk.overall > 70 ? 'Critical' : 
                 biodiversityData.fireRisk.overall > 50 ? 'High' : 'Moderate'}
              </p>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-1">Conservation Value</h4>
              <p className="text-2xl font-bold text-purple-600">
                {biodiversityData.conservationValue.toFixed(0)}
              </p>
              <p className="text-xs text-purple-700">
                {biodiversityData.conservationValue > 70 ? 'Very High' : 
                 biodiversityData.conservationValue > 50 ? 'High' : 'Moderate'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Endangered Species</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {biodiversityData.species.speciesList
                .filter((species: any) => ['EN', 'CR', 'VU'].includes(species.conservationStatus))
                .slice(0, 3)
                .map((species: any, index: number) => (
                  <div key={index} className="p-2 bg-white rounded border border-red-200">
                    <div className="font-medium text-red-800">{species.commonName}</div>
                    <div className="text-xs text-gray-600 italic">{species.scientificName}</div>
                    <div className="text-xs mt-1">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        species.conservationStatus === 'CR' ? 'bg-red-100 text-red-800' :
                        species.conservationStatus === 'EN' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {species.conservationStatus}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Vegetation Indices */}
      {vegetationIndex && (
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Vegetation Indices</h3>
            <span className="text-sm text-gray-500">
              Confidence: {Math.round(vegetationIndex.confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">NDVI</h4>
              <p className="text-2xl font-bold text-green-600">
                {vegetationIndex.ndvi.toFixed(3)}
              </p>
              <p className="text-xs text-green-700">
                {vegetationIndex.ndvi > 0.6 ? 'Healthy' : 
                 vegetationIndex.ndvi > 0.3 ? 'Moderate' : 'Stressed'}
              </p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">EVI</h4>
              <p className="text-2xl font-bold text-blue-600">
                {vegetationIndex.evi.toFixed(3)}
              </p>
              <p className="text-xs text-blue-700">Enhanced Index</p>
            </div>

            <div className="text-center p-3 bg-cyan-50 rounded-lg">
              <h4 className="font-semibold text-cyan-800 mb-1">Moisture</h4>
              <p className="text-2xl font-bold text-cyan-600">
                {Math.round(vegetationIndex.moisture * 100)}%
              </p>
              <p className="text-xs text-cyan-700">Water content</p>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-1">Dryness</h4>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(vegetationIndex.dryness * 100)}%
              </p>
              <p className="text-xs text-orange-700">
                {vegetationIndex.dryness > 0.7 ? 'Critical' : 
                 vegetationIndex.dryness > 0.5 ? 'High' : 'Normal'}
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Interpretation:</strong> NDVI values close to 1 indicate dense, healthy vegetation. 
              {'Low values (<0.3) suggest stressed vegetation or bare soil, increasing fire risk.'}
            </p>
          </div>
        </div>
      )}

      {/* Satellite Imagery */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Satellite className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Satellite Imagery</h3>
          <span className="text-sm text-gray-500">
            Microsoft Planetary Computer
          </span>
        </div>

        {imagery.length === 0 ? (
          <div className="text-center py-8">
            <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No images available for this location</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagery.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className={`flex-shrink-0 p-2 rounded-lg border text-sm ${
                    selectedImage?.id === image.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(image.date), 'dd MMM', { locale: en })}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Cloud className="h-3 w-3" />
                    <span>{image.cloudCover.toFixed(0)}%</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected image details */}
            {selectedImage && (
              <div className="border rounded-lg overflow-hidden">
                {selectedImage.previewUrl && (
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <img
                      src={selectedImage.previewUrl}
                      alt="Satellite imagery"
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div className="text-gray-500 text-center">
                      <Satellite className="h-12 w-12 mx-auto mb-2" />
                      <p>Satellite image preview</p>
                      <p className="text-sm">{selectedImage.platform}</p>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <p className="font-medium">
                        {format(new Date(selectedImage.date), 'dd MMM yyyy, HH:mm', { locale: en })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Platform:</span>
                      <p className="font-medium">{selectedImage.platform}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Cloud Cover:</span>
                      <p className="font-medium">{selectedImage.cloudCover.toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quality:</span>
                      <p className={`font-medium ${
                        selectedImage.cloudCover < 10 ? 'text-green-600' :
                        selectedImage.cloudCover < 30 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {selectedImage.cloudCover < 10 ? 'Excellent' :
                         selectedImage.cloudCover < 30 ? 'Good' : 'Fair'}
                      </p>
                    </div>
                  </div>

                  {selectedImage.ndviUrl && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">NDVI Analysis Available</h4>
                      <p className="text-sm text-green-700">
                        This image includes spectral bands for vegetation analysis and water stress detection.
                      </p>
                    </div>
                  )}

                  {selectedImage.thermalUrl && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Thermal Band Available</h4>
                      <p className="text-sm text-red-700">
                        Includes infrared thermal data for hotspot detection and surface temperature analysis.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Sources */}
      <div className="card">
        <h4 className="font-semibold text-gray-900 mb-3">Data Sources</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span><strong>Microsoft Planetary Computer:</strong> Satellite imagery and vegetation analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span><strong>Microsoft Biodiversity Data Service:</strong> Biodiversity and species data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span><strong>Sentinel-2:</strong> High-resolution multispectral imagery (10m)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span><strong>Landsat-8:</strong> Thermal imagery and historical analysis</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SatelliteImagery