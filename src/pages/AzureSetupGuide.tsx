import React, { useState } from 'react'
import { Cloud, Key, Database, Brain, Zap, BarChart3, Shield, DollarSign, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react'
import { azureConfigManager, loadAzureConfigFromSetup } from '../config/azureConfig'

const AzureSetupGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [setupData, setSetupData] = useState({
    azureMapsKey: '',
    cosmosEndpoint: '',
    cosmosKey: '',
    cognitiveEndpoint: '',
    cognitiveKey: '',
    openaiEndpoint: '',
    openaiKey: '',
    functionsUrl: '',
    insightsKey: ''
  })
  const [isConfigured, setIsConfigured] = useState(false)

  const steps = [
    {
      id: 1,
      title: 'Ejecutar Script de Setup',
      icon: Cloud,
      description: 'Crear toda la infraestructura Azure automáticamente'
    },
    {
      id: 2,
      title: 'Configurar Claves API',
      icon: Key,
      description: 'Introducir las claves generadas por el script'
    },
    {
      id: 3,
      title: 'Verificar Conexiones',
      icon: CheckCircle,
      description: 'Probar que todos los servicios funcionan correctamente'
    }
  ]

  const services = [
    {
      name: 'Azure Maps',
      icon: '🗺️',
      cost: '$50-80/mes',
      description: 'Mapas profesionales, geofencing, rutas optimizadas',
      required: true
    },
    {
      name: 'Cosmos DB',
      icon: '🗄️',
      cost: '$25-40/mes',
      description: 'Base de datos global distribuida, baja latencia',
      required: true
    },
    {
      name: 'Cognitive Services',
      icon: '🧠',
      cost: '$30-50/mes',
      description: 'Análisis de imágenes satelitales, procesamiento IA',
      required: true
    },
    {
      name: 'Azure Functions',
      icon: '⚡',
      cost: '$10-20/mes',
      description: 'Procesamiento serverless, integración APIs',
      required: true
    },
    {
      name: 'Azure OpenAI',
      icon: '🤖',
      cost: '$30-50/mes',
      description: 'GPT-4 para análisis inteligente y recomendaciones',
      required: false
    },
    {
      name: 'Event Hubs',
      icon: '📡',
      cost: '$30-50/mes',
      description: 'Streaming de datos satelitales en tiempo real',
      required: false
    }
  ]

  const handleConfigSubmit = () => {
    loadAzureConfigFromSetup(setupData)
    setIsConfigured(azureConfigManager.isFullyConfigured())
    if (azureConfigManager.isFullyConfigured()) {
      setCurrentStep(3)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const serviceStatus = azureConfigManager.getServiceStatus()
  const costEstimate = azureConfigManager.getCostEstimate()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Setup de Azure Services
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Configuración automática de infraestructura para emergencias
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              Presupuesto: $1,000 USD
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Costo estimado: ${costEstimate.monthly}/mes
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted ? 'bg-green-500 border-green-500 text-white' :
                    isActive ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Services Overview */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Servicios Azure a Configurar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.name} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{service.icon}</span>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">{service.cost}</span>
                        {service.required && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Requerido
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Script Execution */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Paso 1: Ejecutar Script de Setup
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Requisitos Previos</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✅ Cuenta Azure con $1,000 USD de créditos</li>
                    <li>✅ Azure CLI instalado</li>
                    <li>✅ Permisos de Contributor en la suscripción</li>
                  </ul>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-sm font-mono">Terminal</span>
                    <button
                      onClick={() => copyToClipboard('chmod +x scripts/setup-azure-emergency.sh && ./scripts/setup-azure-emergency.sh')}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <code className="text-green-400 text-sm font-mono">
                    chmod +x scripts/setup-azure-emergency.sh<br />
                    ./scripts/setup-azure-emergency.sh
                  </code>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Importante</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        El script creará automáticamente todos los recursos Azure necesarios. 
                        Guarda las claves que se muestren al final del proceso.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                >
                  Script Ejecutado - Continuar con Configuración
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Paso 2: Configurar Claves API
            </h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  Copia las claves del output del script
                </h3>
                <p className="text-sm text-green-800">
                  Al final del script verás un resumen con todas las claves necesarias. 
                  Cópialas e introdúcelas en los campos de abajo.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Azure Maps Key *
                  </label>
                  <input
                    type="password"
                    value={setupData.azureMapsKey}
                    onChange={(e) => setSetupData({...setupData, azureMapsKey: e.target.value})}
                    placeholder="Clave de Azure Maps"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cosmos DB Endpoint *
                  </label>
                  <input
                    type="text"
                    value={setupData.cosmosEndpoint}
                    onChange={(e) => setSetupData({...setupData, cosmosEndpoint: e.target.value})}
                    placeholder="https://emergency-cosmos.documents.azure.com:443/"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cosmos DB Key *
                  </label>
                  <input
                    type="password"
                    value={setupData.cosmosKey}
                    onChange={(e) => setSetupData({...setupData, cosmosKey: e.target.value})}
                    placeholder="Clave de Cosmos DB"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cognitive Services Endpoint *
                  </label>
                  <input
                    type="text"
                    value={setupData.cognitiveEndpoint}
                    onChange={(e) => setSetupData({...setupData, cognitiveEndpoint: e.target.value})}
                    placeholder="https://emergency-cognitive.cognitiveservices.azure.com/"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cognitive Services Key *
                  </label>
                  <input
                    type="password"
                    value={setupData.cognitiveKey}
                    onChange={(e) => setSetupData({...setupData, cognitiveKey: e.target.value})}
                    placeholder="Clave de Cognitive Services"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Insights Key
                  </label>
                  <input
                    type="password"
                    value={setupData.insightsKey}
                    onChange={(e) => setSetupData({...setupData, insightsKey: e.target.value})}
                    placeholder="Clave de Application Insights"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Servicios Opcionales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Azure OpenAI Endpoint (Opcional)
                    </label>
                    <input
                      type="text"
                      value={setupData.openaiEndpoint}
                      onChange={(e) => setSetupData({...setupData, openaiEndpoint: e.target.value})}
                      placeholder="https://emergency-openai.openai.azure.com/"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Azure OpenAI Key (Opcional)
                    </label>
                    <input
                      type="password"
                      value={setupData.openaiKey}
                      onChange={(e) => setSetupData({...setupData, openaiKey: e.target.value})}
                      placeholder="Clave de Azure OpenAI"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfigSubmit}
                disabled={!setupData.azureMapsKey || !setupData.cosmosEndpoint || !setupData.cosmosKey}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Service Status */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estado de Servicios Azure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(serviceStatus).filter(([key]) => key !== 'overall').map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium text-gray-900 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      {status ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-green-600 font-medium">Configurado</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <span className="text-red-600 font-medium">No configurado</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estimación de Costos
              </h2>
              
              <div className="space-y-3">
                {Object.entries(costEstimate.breakdown).map(([service, cost]) => (
                  <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{service}</span>
                    <span className="text-green-600 font-semibold">{cost}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-bold text-blue-900">Total Estimado</span>
                    <span className="text-blue-600 font-bold text-lg">
                      ${costEstimate.monthly}/mes
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3">
                {costEstimate.note}
              </p>
            </div>

            {/* Success Message */}
            {isConfigured && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      ¡Configuración Completada!
                    </h3>
                    <p className="text-green-800">
                      Todos los servicios Azure están configurados y listos para usar. 
                      Tu aplicación de emergencias ahora tiene acceso a capacidades profesionales de IA y análisis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Próximos Pasos
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <p className="font-medium text-blue-900">Obtener NASA FIRMS API Key</p>
                    <p className="text-sm text-blue-700">
                      Regístrate en <a href="https://firms.modaps.eosdis.nasa.gov/api/" target="_blank" rel="noopener noreferrer" className="underline">NASA FIRMS</a> para datos satelitales reales
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-medium text-green-900">Configurar Alertas de Presupuesto</p>
                    <p className="text-sm text-green-700">
                      Configura alertas en Azure para monitorear gastos y evitar sorpresas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <p className="font-medium text-purple-900">Desplegar Azure Functions</p>
                    <p className="text-sm text-purple-700">
                      Sube las funciones para procesamiento automático de datos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Links */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Enlaces Útiles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://portal.azure.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Portal Azure</span>
                </a>
                
                <a
                  href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Gestión de Costos</span>
                </a>
                
                <a
                  href="https://firms.modaps.eosdis.nasa.gov/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 text-red-600" />
                  <span className="font-medium">NASA FIRMS API</span>
                </a>
                
                <a
                  href="https://docs.microsoft.com/en-us/azure/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <ExternalLink className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Documentación Azure</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AzureSetupGuide