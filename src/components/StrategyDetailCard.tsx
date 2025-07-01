import React from 'react'
import { AlertTriangle, CheckCircle, Clock, Users, Truck, Shield } from 'lucide-react'

interface StrategyDetailCardProps {
  strategy: string
  organizationType: string
}

const StrategyDetailCard: React.FC<StrategyDetailCardProps> = ({ strategy, organizationType }) => {
  // Get specific details based on strategy type
  const getStrategyDetails = () => {
    if (strategy.includes('Direct attack')) {
      return {
        title: 'Direct attack with containment lines',
        description: 'Direct application of water or retardants on the active fire edge while establishing a physical barrier between the fire and unburned fuel.',
        steps: [
          'Establish control line by removing fuel down to mineral soil',
          'Apply water/retardants directly on the fire edge',
          'Completely cool edges and extinguish hot spots',
          'Consolidate perimeter with continuous monitoring'
        ],
        advantages: [
          'Quick control of small fires',
          'Minimizes burned area',
          'Allows targeted structure protection',
          'Facilitates team coordination'
        ],
        limitations: [
          'Ineffective for high-intensity fires',
          'Requires abundant water supply',
          'Greater personnel exposure to heat',
          'Difficult in steep terrain'
        ],
        equipment: [
          'Wildland fire engines',
          'High-pressure hoses',
          'Complete PPE',
          'Hand tools',
          'Backpack extinguishers',
          'Communication radios'
        ],
        icon: Truck,
        color: 'red'
      }
    } else if (strategy.includes('advanced medical posts')) {
      return {
        title: 'Establishment of advanced medical posts',
        description: 'Installation of medical posts in strategic locations to provide immediate care and coordinate medical evacuation.',
        steps: [
          'Establish AMP in safe area less than 10 minutes from incident',
          'Classify patients using START triage system',
          'Provide basic/advanced life support as needed',
          'Coordinate evacuation to medical centers by priority'
        ],
        advantages: [
          'Immediate medical care in impact zone',
          'Optimization of medical resources',
          'Better prognosis for critical patients',
          'Hospital decongestion'
        ],
        limitations: [
          'Requires specialized medical personnel',
          'Equipment limitations',
          'Dependence on weather conditions',
          'Need for personnel rotation'
        ],
        equipment: [
          'Medical tents',
          'BLS/ALS equipment',
          'Triage materials',
          'Stretchers/immobilizers',
          'Oxygen therapy',
          'Communication systems'
        ],
        icon: CheckCircle,
        color: 'blue'
      }
    } else if (strategy.includes('Perimeter control')) {
      return {
        title: 'Perimeter control and evacuation management',
        description: 'Establishment of security perimeter, access control and coordination of orderly civilian evacuation.',
        steps: [
          'Establish security perimeters (hot, warm and cold zones)',
          'Control access allowing only authorized personnel',
          'Coordinate evacuation by priority zones',
          'Implement alternative traffic plan'
        ],
        advantages: [
          'Effective control of affected area',
          'Safe and orderly evacuation',
          'Prevention of secondary accidents',
          'Facilitates emergency teams work'
        ],
        limitations: [
          'Requires large amount of personnel',
          'Difficulty in extensive areas',
          'Resistance from population to evacuate',
          'Complexity in dense urban areas'
        ],
        equipment: [
          'Patrol vehicles',
          'Barriers/cones',
          'Megaphones',
          'Reflective vests',
          'Communication radios',
          'Surveillance drones'
        ],
        icon: Shield,
        color: 'indigo'
      }
    } else if (strategy.includes('Interagency coordination')) {
      return {
        title: 'Interagency coordination and comprehensive management',
        description: 'Coordination of all resources and agencies involved, establishing a unified command system to manage the comprehensive response.',
        steps: [
          'Establish Advanced Command Post (ACP)',
          'Activate Incident Command System (ICS)',
          'Coordinate efficient resource allocation',
          'Establish official public information channel'
        ],
        advantages: [
          'Coordinated and efficient response',
          'Resource optimization',
          'Effective communication between agencies',
          'Centralized decision making'
        ],
        limitations: [
          'Organizational complexity',
          'Possible conflicts between agencies',
          'Requires specialized personnel',
          'Communication dependency'
        ],
        equipment: [
          'Mobile command post',
          'Communication systems',
          'Computer equipment',
          'Maps/whiteboards',
          'Generators',
          'Drones/cameras'
        ],
        icon: Users,
        color: 'green'
      }
    } else {
      return {
        title: 'Custom strategy',
        description: 'Tactical plan adapted to the specific needs of the emergency and organization capabilities.',
        steps: [
          'Evaluate situation and available resources',
          'Establish priority objectives',
          'Implement tactical actions',
          'Evaluate results and adjust'
        ],
        advantages: [
          'Adaptability to the situation',
          'Operational flexibility',
          'Optimization of own resources',
          'Focus on specific capabilities'
        ],
        limitations: [
          'Requires experience and judgment',
          'Possible lack of standardization',
          'Need for additional coordination',
          'Dependence on effective leadership'
        ],
        equipment: [
          'Specialized equipment',
          'Communication systems',
          'Specific tools',
          'Adapted vehicles',
          'Appropriate PPE',
          'Technical material'
        ],
        icon: AlertTriangle,
        color: 'gray'
      }
    }
  }

  const details = getStrategyDetails()
  const Icon = details.icon
  const colorClass = `text-${details.color}-600`
  const bgColorClass = `bg-${details.color}-50`
  const borderColorClass = `border-${details.color}-200`

  return (
    <div className={`p-6 ${bgColorClass} rounded-lg border ${borderColorClass}`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`h-6 w-6 ${colorClass}`} />
        <h3 className="text-lg font-semibold text-gray-900">{details.title}</h3>
      </div>
      
      <p className="text-gray-700 mb-6">{details.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            Implementation Steps
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            {details.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-600" />
            Required Equipment
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            {details.equipment.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Advantages</h4>
          <ul className="space-y-1 text-sm text-green-700">
            {details.advantages.map((advantage, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">Limitations</h4>
          <ul className="space-y-1 text-sm text-red-700">
            {details.limitations.map((limitation, index) => (
              <li key={index} className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Considerations for {organizationType}</h4>
        <p className="text-sm text-blue-700">
          {organizationType === 'firefighters' && 'This strategy is optimized for firefighting teams with direct attack capability. Make sure to maintain escape routes, establish safety zones and maintain constant communication with command post.'}
          {organizationType === 'medical' && 'This strategy prioritizes medical care and casualty evacuation. Coordinate with firefighters to ensure safe zones for AMPs and establish communication with receiving hospitals.'}
          {organizationType === 'police' && 'This strategy focuses on perimeter control and safe evacuation. Coordinate with firefighters to understand fire evolution and with medical services to prioritize evacuations.'}
          {organizationType === 'civil_protection' && 'This strategy emphasizes coordination between agencies. Make sure to establish a unified command system and maintain effective communication with all deployed units.'}
          {!['firefighters', 'medical', 'police', 'civil_protection'].includes(organizationType) && 'This strategy has been adapted to the specific capabilities of your organization. Make sure to coordinate with other emergency services for an integrated response.'}
        </p>
      </div>
    </div>
  )
}

export default StrategyDetailCard