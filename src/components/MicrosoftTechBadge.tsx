import React from 'react';
import { azureConfig } from '../services/azureConfigLoader';

interface MicrosoftTechBadgeProps {
  className?: string;
}

const MicrosoftTechBadge: React.FC<MicrosoftTechBadgeProps> = ({ className = '' }) => {
  const configStatus = azureConfig.getConfigStatus();
  
  const services = [
    { name: 'Azure Maps', enabled: configStatus.azureMaps, icon: '🗺️' },
    { name: 'Cognitive Services', enabled: configStatus.cognitiveServices, icon: '🧠' },
    { name: 'Application Insights', enabled: configStatus.appInsights, icon: '📊' },
    { name: 'Azure Storage', enabled: configStatus.storage, icon: '🗄️' },
    { name: 'Azure Functions', enabled: configStatus.functions, icon: '⚡' }
  ];

  const enabledCount = services.filter(s => s.enabled).length;
  
  return (
    <div className={`bg-[#0078d4] text-white rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#0078d4] font-bold text-xs">M</span>
        </div>
        <span className="font-semibold">Microsoft Azure</span>
        <span className="text-xs bg-white text-[#0078d4] px-1.5 rounded-full ml-auto">
          {enabledCount}/{services.length}
        </span>
      </div>
      
      <div className="space-y-1 text-xs">
        {services.map((service) => (
          <div key={service.name} className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${service.enabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
            <span>{service.icon} {service.name}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 pt-2 border-t border-blue-400 text-xs text-center">
        Powered by Microsoft Azure
      </div>
    </div>
  );
};

export default MicrosoftTechBadge;