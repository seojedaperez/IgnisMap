import React, { useState } from 'react'
import { Shield, Truck, Heart, Users, AlertTriangle, Phone, Radio, Mail } from 'lucide-react'
import { OrganizationConfig } from '../App'

interface WelcomeScreenProps {
  onSetup: (config: OrganizationConfig) => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetup }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'firefighters' as OrganizationConfig['type'],
    phone: '',
    radio: '',
    email: ''
  })

  const organizationTypes = [
    {
      id: 'firefighters',
      name: 'Fire Department',
      icon: Truck,
      description: 'Fire suppression and rescue',
      capabilities: ['Fire suppression', 'Technical rescue', 'Hazardous materials', 'Basic emergency medical'],
      color: 'bg-red-500'
    },
    {
      id: 'medical',
      name: 'Emergency Medical Services',
      icon: Heart,
      description: 'Medical care and evacuation',
      capabilities: ['Advanced medical care', 'Medical evacuation', 'Mass casualty triage', 'Life support'],
      color: 'bg-blue-500'
    },
    {
      id: 'police',
      name: 'Law Enforcement',
      icon: Shield,
      description: 'Security and evacuation control',
      capabilities: ['Traffic control', 'Civilian evacuation', 'Perimeter security', 'Communications'],
      color: 'bg-indigo-500'
    },
    {
      id: 'civil_protection',
      name: 'Civil Protection',
      icon: Users,
      description: 'Emergency coordination and management',
      capabilities: ['Interagency coordination', 'Shelter management', 'Public communication', 'Logistics'],
      color: 'bg-green-500'
    },
    {
      id: 'other',
      name: 'Other Organization',
      icon: AlertTriangle,
      description: 'Specialized organization',
      capabilities: ['Custom capabilities'],
      color: 'bg-gray-500'
    }
  ]

  const selectedType = organizationTypes.find(type => type.id === formData.type)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter your organization name')
      return
    }

    const config: OrganizationConfig = {
      name: formData.name,
      type: formData.type,
      contactInfo: {
        phone: formData.phone,
        radio: formData.radio,
        email: formData.email
      },
      capabilities: selectedType?.capabilities || []
    }

    onSetup(config)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <div className="p-3 md:p-4 bg-red-600 rounded-full">
              <AlertTriangle className="h-8 w-8 md:h-12 md:w-12 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
            Integrated Emergency System
          </h1>
          <p className="text-base md:text-xl text-gray-600 mb-2 md:mb-4">
            Powered by Microsoft Azure AI
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
            <span>🛰️ Satellite Data</span>
            <span>🤖 Azure ML</span>
            <span>🗺️ Azure Maps</span>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
            Organization Configuration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="E.g.: Madrid Volunteer Firefighters"
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                required
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-4">
                Organization Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {organizationTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id as any })}
                      className={`p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === type.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                        <div className={`p-1.5 md:p-2 ${type.color} rounded-lg`}>
                          <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">{type.name}</h3>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{type.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Capabilities Preview */}
            {selectedType && (
              <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">System Capabilities:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2">
                  {selectedType.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      {capability}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  <Phone className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+34 112"
                  className="w-full px-3 py-2 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  <Radio className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                  Radio Channel
                </label>
                <input
                  type="text"
                  value={formData.radio}
                  onChange={(e) => setFormData({ ...formData, radio: e.target.value })}
                  placeholder="Channel 1"
                  className="w-full px-3 py-2 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  <Mail className="h-3 w-3 md:h-4 md:w-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="emergency@org.com"
                  className="w-full px-3 py-2 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Azure Services Info */}
            <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">🚀 Integrated Azure Services:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 text-xs md:text-sm text-blue-800">
                <div>✓ Azure OpenAI</div>
                <div>✓ Azure Maps</div>
                <div>✓ Azure ML</div>
                <div>✓ Cognitive Services</div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5" />
              Configure Emergency System
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 md:mt-8 text-xs md:text-sm text-gray-500">
          <p>System developed with Microsoft Azure for professional emergency management</p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen