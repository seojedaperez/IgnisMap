import React, { useState } from 'react'
import { Bell, MapPin, Cloud, Shield, Smartphone, Globe, Key } from 'lucide-react'
import { useWeather } from '../contexts/WeatherContext'

const Settings: React.FC = () => {
  const { configureAzureMaps, serviceStatus } = useWeather()
  const [azureSubscriptionKey, setAzureSubscriptionKey] = useState('')
  const [notifications, setNotifications] = useState({
    fireAlerts: true,
    weatherUpdates: true,
    systemAlerts: false,
    emailNotifications: true,
    pushNotifications: true
  })

  const [location, setLocation] = useState({
    autoDetect: true,
    latitude: '40.4168',
    longitude: '-3.7038',
    region: 'Madrid, España'
  })

  const [preferences, setPreferences] = useState({
    language: 'es',
    units: 'metric',
    theme: 'light',
    updateInterval: '15'
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handleLocationChange = (key: string, value: string | boolean) => {
    setLocation(prev => ({ ...prev, [key]: value }))
  }

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleAzureConfiguration = () => {
    if (azureSubscriptionKey.trim()) {
      configureAzureMaps(azureSubscriptionKey.trim())
      alert('✅ Azure Maps Weather Services configurado correctamente')
    } else {
      alert('❌ Por favor, introduce una clave de suscripción válida')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">Personaliza tu experiencia con IgnisMap</p>
      </div>

      {/* Azure Maps Configuration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Key className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Azure Maps Weather Services</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Estado del Servicio</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Proveedor:</span>
                <span className="font-medium text-blue-900">{serviceStatus.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Estado:</span>
                <span className={`font-medium ${serviceStatus.configured ? 'text-green-600' : 'text-orange-600'}`}>
                  {serviceStatus.configured ? '✅ Configurado' : '⚠️ No configurado'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Fallback disponible:</span>
                <span className="font-medium text-blue-900">
                  {serviceStatus.fallbackAvailable ? '✅ Sí (Open-Meteo)' : '❌ No'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clave de Suscripción de Azure Maps
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={azureSubscriptionKey}
                onChange={(e) => setAzureSubscriptionKey(e.target.value)}
                placeholder="Introduce tu Azure Maps Subscription Key"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAzureConfiguration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Configurar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Obtén tu clave gratuita en: <a href="https://azure.microsoft.com/en-us/products/azure-maps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Azure Maps</a>
            </p>
          </div>

          {serviceStatus.configured && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Capacidades Habilitadas</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {serviceStatus.capabilities.map((capability, index) => (
                  <div key={index} className="flex items-center gap-1 text-green-700">
                    <span className="text-green-600">✓</span>
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-6 w-6 text-fire-600" />
          <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Alertas de Incendio</h3>
              <p className="text-sm text-gray-600">Recibir notificaciones de riesgo alto y extremo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.fireAlerts}
                onChange={(e) => handleNotificationChange('fireAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Actualizaciones Meteorológicas</h3>
              <p className="text-sm text-gray-600">Cambios significativos en las condiciones del tiempo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.weatherUpdates}
                onChange={(e) => handleNotificationChange('weatherUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Alertas del Sistema</h3>
              <p className="text-sm text-gray-600">Mantenimiento y actualizaciones de la aplicación</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.systemAlerts}
                onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
              <p className="text-sm text-gray-600">Resúmenes diarios y alertas importantes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailNotifications}
                onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Notificaciones Push</h3>
              <p className="text-sm text-gray-600">Alertas instantáneas en tu dispositivo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-6 w-6 text-fire-600" />
          <h2 className="text-xl font-semibold text-gray-900">Ubicación</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Detección Automática</h3>
              <p className="text-sm text-gray-600">Usar GPS para determinar tu ubicación</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={location.autoDetect}
                onChange={(e) => handleLocationChange('autoDetect', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fire-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fire-600"></div>
            </label>
          </div>

          {!location.autoDetect && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud
                </label>
                <input
                  type="text"
                  value={location.latitude}
                  onChange={(e) => handleLocationChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud
                </label>
                <input
                  type="text"
                  value={location.longitude}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Región Actual
            </label>
            <input
              type="text"
              value={location.region}
              onChange={(e) => handleLocationChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
              placeholder="Ej: Madrid, España"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-6 w-6 text-fire-600" />
          <h2 className="text-xl font-semibold text-gray-900">Preferencias</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidades
            </label>
            <select
              value={preferences.units}
              onChange={(e) => handlePreferenceChange('units', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
            >
              <option value="metric">Métricas (°C, km/h)</option>
              <option value="imperial">Imperiales (°F, mph)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tema
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalo de Actualización
            </label>
            <select
              value={preferences.updateInterval}
              onChange={(e) => handlePreferenceChange('updateInterval', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500"
            >
              <option value="5">5 minutos</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
            </select>
          </div>
        </div>
      </div>

      {/* Azure Integration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6 text-fire-600" />
          <h2 className="text-xl font-semibold text-gray-900">Integración con Azure</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Estado de Conexión</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-blue-700">Conectado a Azure Cognitive Services</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${serviceStatus.configured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span className="text-sm text-blue-700">
                Azure Maps Weather Services {serviceStatus.configured ? 'activo' : 'pendiente de configuración'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-blue-700">Microsoft Planetary Computer configurado</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Región de Azure
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500">
                <option>West Europe</option>
                <option>East US</option>
                <option>Southeast Asia</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Servicio
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fire-500 focus:border-fire-500">
                <option>Standard</option>
                <option>Premium</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="h-6 w-6 text-fire-600" />
          <h2 className="text-xl font-semibold text-gray-900">Aplicación Web Progresiva</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Estado PWA</h3>
            <p className="text-sm text-green-700">
              La aplicación está optimizada para funcionar offline y puede instalarse en tu dispositivo.
            </p>
          </div>

          <div className="flex gap-4">
            <button className="btn-primary">
              Instalar Aplicación
            </button>
            <button className="btn-secondary">
              Limpiar Caché
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="btn-primary px-8">
          Guardar Configuración
        </button>
      </div>
    </div>
  )
}

export default Settings
