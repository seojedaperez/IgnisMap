import React, { useState } from 'react';
import { Leaf, Users, Building, AlertTriangle, Clock, MapPin, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { SpeciesData, VegetationData, BiodiversityAssessment } from '../services/microsoftBiodiversityService';

interface BiodiversityDataDisplayProps {
  biodiversityData: BiodiversityAssessment;
  className?: string;
}

const BiodiversityDataDisplay: React.FC<BiodiversityDataDisplayProps> = ({ 
  biodiversityData, 
  className = '' 
}) => {
  const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'species' | 'vegetation' | 'threats'>('species');

  const getConservationColor = (status: string) => {
    switch (status) {
      case 'CR': return 'text-red-600 bg-red-100';
      case 'EN': return 'text-orange-600 bg-orange-100';
      case 'VU': return 'text-yellow-600 bg-yellow-100';
      case 'NT': return 'text-blue-600 bg-blue-100';
      case 'LC': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConservationLabel = (status: string) => {
    switch (status) {
      case 'CR': return 'Critically Endangered';
      case 'EN': return 'Endangered';
      case 'VU': return 'Vulnerable';
      case 'NT': return 'Near Threatened';
      case 'LC': return 'Least Concern';
      case 'DD': return 'Data Deficient';
      default: return 'Not Evaluated';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600 bg-red-100';
    if (risk >= 60) return 'text-orange-600 bg-orange-100';
    if (risk >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getThreatsColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter endangered species
  const endangeredSpecies = biodiversityData.species.speciesList.filter(
    species => ['CR', 'EN', 'VU'].includes(species.conservationStatus)
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Biodiversity Summary</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{biodiversityData.species.count}</div>
            <div className="text-sm text-green-700">Identified Species</div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{biodiversityData.species.endangered}</div>
            <div className="text-sm text-red-700">Threatened Species</div>
          </div>

          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{biodiversityData.conservationValue.toFixed(0)}</div>
            <div className="text-sm text-blue-700">Conservation Value</div>
          </div>

          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{biodiversityData.fireRisk.overall.toFixed(0)}</div>
            <div className="text-sm text-orange-700">Fire Risk</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <span className="font-medium text-gray-900">Ecosystem: {biodiversityData.location.ecosystem}</span>
          </div>
          <div className="text-sm text-gray-600">
            Data obtained through Microsoft Planetary Computer and satellite analysis. 
            Data confidence: {(biodiversityData.dataQuality.overallConfidence * 100).toFixed(0)}%.
          </div>
        </div>
      </div>

      {/* Endangered Species - Featured */}
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-900">Endangered Species</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {endangeredSpecies.length > 0 ? (
            endangeredSpecies.map((species) => (
              <div key={species.id} className="p-3 bg-white rounded-lg border border-red-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{species.commonName}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getConservationColor(species.conservationStatus)}`}>
                    {species.conservationStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic mb-2">{species.scientificName}</p>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{getConservationLabel(species.conservationStatus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-medium">{species.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Habitat:</span>
                    <span className="font-medium">{species.habitat}</span>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-red-100">
                  <span className="text-xs font-medium text-red-700">Main threats:</span>
                  <ul className="mt-1 space-y-0.5">
                    {species.threats.slice(0, 2).map((threat, idx) => (
                      <li key={idx} className="text-xs text-red-600 flex items-start gap-1">
                        <span>•</span> {threat}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {species.imageUrl && (
                  <div className="mt-2 h-20 w-full overflow-hidden rounded-md">
                    <img 
                      src={species.imageUrl} 
                      alt={species.commonName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full p-4 text-center">
              <p className="text-red-700">No endangered species detected in this area.</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Impact of Fires on Threatened Species</h4>
          <p className="text-sm text-red-700">
            Wildfires can have a devastating impact on threatened species populations, 
            destroying critical habitats and eliminating food resources. Recovery of these populations 
            can take decades, especially for species with low reproductive rates or high specialization.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('species')}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm ${
            activeTab === 'species'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Leaf className="h-4 w-4" />
          Species
        </button>
        <button
          onClick={() => setActiveTab('vegetation')}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm ${
            activeTab === 'vegetation'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Vegetation
        </button>
        <button
          onClick={() => setActiveTab('threats')}
          className={`flex items-center gap-2 py-2 px-4 font-medium text-sm ${
            activeTab === 'threats'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Threats
        </button>
      </div>

      {/* Species Tab */}
      {activeTab === 'species' && (
        <div className="space-y-4">
          {/* Species List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Species in the Area</h3>
            
            <div className="space-y-3">
              {biodiversityData.species.speciesList.map((species) => (
                <div 
                  key={species.id} 
                  className="border rounded-lg overflow-hidden"
                >
                  <div 
                    className="p-3 bg-gray-50 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedSpecies(expandedSpecies === species.id ? null : species.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConservationColor(species.conservationStatus)}`}>
                        {species.conservationStatus}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{species.commonName}</h4>
                        <p className="text-xs text-gray-500 italic">{species.scientificName}</p>
                      </div>
                    </div>
                    <div>
                      {expandedSpecies === species.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSpecies === species.id && (
                    <div className="p-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Conservation status:</span>
                            <p className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-medium ${getConservationColor(species.conservationStatus)}`}>
                              {getConservationLabel(species.conservationStatus)}
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Estimated population:</span>
                            <p className="text-sm text-gray-900 mt-1">{species.population.toLocaleString()} individuals</p>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Habitat:</span>
                            <p className="text-sm text-gray-900 mt-1">{species.habitat}</p>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Last observation:</span>
                            <p className="text-sm text-gray-900 mt-1">{formatDate(species.lastObserved)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Threats:</span>
                            <ul className="mt-1 space-y-1">
                              {species.threats.map((threat, index) => (
                                <li key={index} className="text-sm text-gray-900 flex items-start gap-2">
                                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                  <span>{threat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {species.imageUrl && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Image:</span>
                              <div className="mt-1 rounded-lg overflow-hidden h-32 bg-gray-100">
                                <img 
                                  src={species.imageUrl} 
                                  alt={species.commonName} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            Coordinates: {species.coordinates.latitude.toFixed(6)}, {species.coordinates.longitude.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Biodiversity Indices</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Species richness:</span>
                  <p className="font-medium text-blue-900">{biodiversityData.species.richness.toFixed(2)} species/km²</p>
                </div>
                <div>
                  <span className="text-blue-700">Shannon index:</span>
                  <p className="font-medium text-blue-900">{biodiversityData.species.shannon.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vegetation Tab */}
      {activeTab === 'vegetation' && (
        <div className="space-y-4">
          {/* Vegetation Indices */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vegetation Indices</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{biodiversityData.vegetation.ndvi.toFixed(2)}</div>
                <div className="text-sm text-green-700">NDVI</div>
                <div className="text-xs text-green-600">Vegetation Index</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{biodiversityData.vegetation.evi.toFixed(2)}</div>
                <div className="text-sm text-green-700">EVI</div>
                <div className="text-xs text-green-600">Enhanced Index</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{biodiversityData.vegetation.lai.toFixed(1)}</div>
                <div className="text-sm text-green-700">LAI</div>
                <div className="text-xs text-green-600">Leaf Area Index</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{biodiversityData.vegetation.fpar.toFixed(2)}</div>
                <div className="text-sm text-green-700">FPAR</div>
                <div className="text-xs text-green-600">PAR Fraction</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Index Interpretation</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li><span className="font-medium">NDVI:</span> Values close to 1 indicate dense, healthy vegetation. Low values indicate stressed vegetation or bare soil.</li>
                <li><span className="font-medium">EVI:</span> Similar to NDVI but with better sensitivity in high biomass areas and less atmospheric influence.</li>
                <li><span className="font-medium">LAI:</span> Leaf area per unit of ground surface. High values indicate dense canopy.</li>
                <li><span className="font-medium">FPAR:</span> Fraction of photosynthetically active radiation absorbed by vegetation.</li>
              </ul>
            </div>
          </div>
          
          {/* Land Cover */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Land Cover</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  {Object.entries(biodiversityData.vegetation.landCover).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${
                            key === 'forest' ? 'bg-green-600' :
                            key === 'grassland' ? 'bg-lime-500' :
                            key === 'cropland' ? 'bg-yellow-500' :
                            key === 'wetland' ? 'bg-blue-500' :
                            key === 'urban' ? 'bg-gray-500' :
                            key === 'barren' ? 'bg-amber-700' :
                            'bg-blue-700'
                          }`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900 w-24">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Forest Characteristics</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700">Biomass:</span>
                      <p className="font-medium text-blue-900">{biodiversityData.vegetation.biomass.toFixed(1)} ton/ha</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Canopy height:</span>
                      <p className="font-medium text-blue-900">{biodiversityData.vegetation.canopyHeight.toFixed(1)} m</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Fire History</h4>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  {biodiversityData.vegetation.fireHistory.lastBurnDate ? (
                    <>
                      <div className="mb-2">
                        <span className="text-sm text-orange-700">Last fire:</span>
                        <p className="font-medium text-orange-900">{formatDate(biodiversityData.vegetation.fireHistory.lastBurnDate)}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-orange-700 mb-2">No records of recent fires in this area.</p>
                  )}
                  
                  <div className="mb-2">
                    <span className="text-sm text-orange-700">Fire frequency:</span>
                    <p className="font-medium text-orange-900">{biodiversityData.vegetation.fireHistory.burnFrequency.toFixed(1)} per decade</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-orange-700">Historical severity:</span>
                    <p className="font-medium text-orange-900 capitalize">{biodiversityData.vegetation.fireHistory.severity}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Biodiversity Impact</h4>
                  <p className="text-sm text-green-700">
                    Current vegetation shows {biodiversityData.vegetation.ndvi > 0.6 ? 'good health' : biodiversityData.vegetation.ndvi > 0.4 ? 'moderate health' : 'signs of stress'}.
                    {biodiversityData.vegetation.ndvi < 0.4 ? ' Possible impact from drought or recent disturbances.' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threats Tab */}
      {activeTab === 'threats' && (
        <div className="space-y-4">
          {/* Fire Risk */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fire Risk</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200 md:col-span-2">
                <div className="text-3xl font-bold text-red-600">{biodiversityData.fireRisk.overall.toFixed(0)}</div>
                <div className="text-sm text-red-700">Overall Risk</div>
                <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${getRiskColor(biodiversityData.fireRisk.overall)}`}>
                  {biodiversityData.fireRisk.overall >= 80 ? 'EXTREME' : 
                   biodiversityData.fireRisk.overall >= 60 ? 'HIGH' : 
                   biodiversityData.fireRisk.overall >= 40 ? 'MODERATE' : 'LOW'}
                </div>
              </div>
              
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{biodiversityData.fireRisk.vegetation.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Vegetation</div>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{biodiversityData.fireRisk.weather.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Weather</div>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{biodiversityData.fireRisk.topography.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Topography</div>
                </div>
                
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-700">{biodiversityData.fireRisk.humanActivity.toFixed(0)}</div>
                  <div className="text-xs text-gray-600">Human Activity</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">Risk Factors</h4>
              <ul className="space-y-1 text-sm text-orange-700">
                {biodiversityData.vegetation.ndvi < 0.4 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Stressed vegetation (low NDVI) increases flammability</span>
                  </li>
                )}
                {biodiversityData.vegetation.landCover.forest > 50 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>High forest density ({biodiversityData.vegetation.landCover.forest.toFixed(0)}%) increases fuel load</span>
                  </li>
                )}
                {biodiversityData.fireRisk.weather > 70 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Adverse weather conditions (index {biodiversityData.fireRisk.weather.toFixed(0)}/100)</span>
                  </li>
                )}
                {biodiversityData.fireRisk.humanActivity > 60 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>High human activity increases ignition risk</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          {/* Environmental Threats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Threats</h3>
            
            <div className="space-y-3">
              {biodiversityData.threats.map((threat, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getThreatsColor(threat.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{threat.type}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThreatsColor(threat.severity)}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{threat.scope}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{threat.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Impact:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          threat.impact >= 80 ? 'bg-red-600' :
                          threat.impact >= 60 ? 'bg-orange-600' :
                          threat.impact >= 40 ? 'bg-yellow-600' :
                          'bg-green-600'
                        }`}
                        style={{ width: `${threat.impact}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{threat.impact}/100</span>
                  </div>
                </div>
              ))}
            </div>
            
            {biodiversityData.protectedAreas.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Nearby Protected Areas</h4>
                <div className="space-y-2">
                  {biodiversityData.protectedAreas.map((area, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-blue-900">{area.name}</span>
                        <span className="text-xs text-blue-700 ml-2">({area.type})</span>
                      </div>
                      <div className="text-blue-700">{area.distance.toFixed(1)} km</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Source */}
      <div className="text-xs text-gray-500 text-center">
        Data provided by Microsoft Planetary Computer and Microsoft Biodiversity Data Service
        <br />
        Last update: {formatDate(biodiversityData.dataQuality.lastUpdated)}
      </div>
    </div>
  );
};

export default BiodiversityDataDisplay;