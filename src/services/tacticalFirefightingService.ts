// Professional Tactical Firefighting Service
// Based on NWCG (National Wildfire Coordinating Group) and IFSTA standards

interface TacticalPlan {
  id: string
  name: string
  priority: number // 1-10
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme'
  personnelRequired: number
  equipmentRequired: string[]
  estimatedDuration: number // hours
  successProbability: number // 0-1
  casualties: {
    civilianRisk: number
    firefighterRisk: number
    environmentalImpact: number
  }
  phases: TacticalPhase[]
  contingencyPlans: string[]
  criticalFactors: string[]
}

interface TacticalPhase {
  phase: number
  name: string
  duration: number // minutes
  objectives: string[]
  resources: ResourceDeployment[]
  safetyMeasures: string[]
  successCriteria: string[]
  fallbackOptions: string[]
}

interface ResourceDeployment {
  type: 'ground_crew' | 'aerial' | 'heavy_equipment' | 'water_supply'
  units: number
  location: { latitude: number, longitude: number }
  assignment: string
  communicationChannel: string
  escapeRoutes: string[]
  safetyZones: string[]
}

interface WaterSource {
  id: string
  type: 'natural' | 'artificial' | 'mobile'
  location: { latitude: number, longitude: number }
  capacity: number // liters
  flowRate: number // liters/minute
  accessibility: 'excellent' | 'good' | 'difficult' | 'extreme'
  distance: number // km from fire
  setupTime: number // minutes
  reliability: number // 0-1
}

interface FirebreakStrategy {
  id: string
  type: 'natural' | 'constructed' | 'burnout' | 'backfire'
  location: Array<{ latitude: number, longitude: number }>
  width: number // meters
  length: number // meters
  constructionTime: number // hours
  effectiveness: number // 0-1
  environmentalImpact: 'minimal' | 'moderate' | 'significant'
  riskToPersonnel: 'low' | 'moderate' | 'high' | 'extreme'
}

class TacticalFirefightingService {
  // Generate comprehensive tactical plans based on fire conditions
  async generateTacticalPlans(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    spreadPrediction: any,
    riskAssessment: any
  ): Promise<TacticalPlan[]> {
    const plans: TacticalPlan[] = []
    
    // Plan 1: Defensive Strategy (Highest Safety)
    plans.push(await this.createDefensiveStrategy(fireLocation, windAnalysis, riskAssessment))
    
    // Plan 2: Offensive Strategy (Aggressive Attack)
    plans.push(await this.createOffensiveStrategy(fireLocation, windAnalysis, riskAssessment))
    
    // Plan 3: Indirect Attack Strategy
    plans.push(await this.createIndirectAttackStrategy(fireLocation, windAnalysis, riskAssessment))
    
    // Plan 4: Containment Strategy
    plans.push(await this.createContainmentStrategy(fireLocation, windAnalysis, riskAssessment))
    
    // Plan 5: Controlled Burn Strategy
    plans.push(await this.createControlledBurnStrategy(fireLocation, windAnalysis, riskAssessment))
    
    return plans.sort((a, b) => b.priority - a.priority)
  }

  // Identify optimal water sources for firefighting operations
  async identifyWaterSources(
    fireLocation: { latitude: number, longitude: number },
    radius: number = 20 // km
  ): Promise<WaterSource[]> {
    // In production, this would query GIS databases and real-time water level data
    return this.generateWaterSources(fireLocation, radius)
  }

  // Design firebreak strategies
  async designFirebreaks(
    fireLocation: { latitude: number, longitude: number },
    windDirection: number,
    spreadPrediction: any
  ): Promise<FirebreakStrategy[]> {
    const strategies: FirebreakStrategy[] = []
    
    // Natural firebreaks (roads, rivers, clearings)
    strategies.push(...this.identifyNaturalFirebreaks(fireLocation, windDirection))
    
    // Constructed firebreaks
    strategies.push(...this.designConstructedFirebreaks(fireLocation, windDirection))
    
    // Burnout operations
    strategies.push(...this.designBurnoutOperations(fireLocation, windDirection))
    
    // Backfire operations (high risk, high reward)
    strategies.push(...this.designBackfireOperations(fireLocation, windDirection))
    
    return strategies
  }

  private async createDefensiveStrategy(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    riskAssessment: any
  ): Promise<TacticalPlan> {
    return {
      id: 'defensive_001',
      name: 'Estrategia Defensiva - Protección de Vidas y Estructuras',
      priority: 10,
      riskLevel: 'low',
      personnelRequired: 45,
      equipmentRequired: [
        '8 Autobombas Forestales',
        '3 Camiones Cisterna',
        '2 Unidades de Comando',
        '4 Vehículos de Rescate',
        'Equipos de Comunicación Redundantes'
      ],
      estimatedDuration: 12,
      successProbability: 0.85,
      casualties: {
        civilianRisk: 0.05,
        firefighterRisk: 0.15,
        environmentalImpact: 0.7
      },
      phases: [
        {
          phase: 1,
          name: 'Establecimiento de Perímetro Defensivo',
          duration: 60,
          objectives: [
            'Establecer líneas defensivas alrededor de estructuras críticas',
            'Crear zonas de seguridad para personal',
            'Instalar sistemas de rociadores perimetrales'
          ],
          resources: [
            {
              type: 'ground_crew',
              units: 6,
              location: fireLocation,
              assignment: 'Protección estructural',
              communicationChannel: 'Canal 1 - Comando',
              escapeRoutes: ['Carretera Principal Norte', 'Camino Forestal Este'],
              safetyZones: ['Zona Deportiva Municipal', 'Aparcamiento Hospital']
            }
          ],
          safetyMeasures: [
            'Mantener distancia mínima de 100m del fuego',
            'Establecer vigilantes de seguridad',
            'Comunicación cada 10 minutos'
          ],
          successCriteria: [
            'Perímetro defensivo establecido',
            'Comunicaciones operativas',
            'Rutas de escape despejadas'
          ],
          fallbackOptions: [
            'Retirada a zona de seguridad secundaria',
            'Activación de protocolo de emergencia'
          ]
        },
        {
          phase: 2,
          name: 'Supresión Indirecta',
          duration: 180,
          objectives: [
            'Crear cortafuegos húmedos',
            'Eliminar combustible en líneas defensivas',
            'Proteger infraestructura crítica'
          ],
          resources: [
            {
              type: 'aerial',
              units: 2,
              location: fireLocation,
              assignment: 'Descarga de retardante en líneas defensivas',
              communicationChannel: 'Canal 2 - Aéreo',
              escapeRoutes: ['Aeródromo Base'],
              safetyZones: ['Zona de Aterrizaje Emergencia']
            }
          ],
          safetyMeasures: [
            'Coordinación aire-tierra estricta',
            'Monitoreo continuo de condiciones meteorológicas',
            'Protocolos de comunicación redundantes'
          ],
          successCriteria: [
            'Líneas defensivas húmedas establecidas',
            'Combustible reducido en 80%',
            'Estructuras protegidas'
          ],
          fallbackOptions: [
            'Retirada escalonada',
            'Activación de sistemas automáticos'
          ]
        }
      ],
      contingencyPlans: [
        'Plan de evacuación masiva si el viento cambia',
        'Protocolo de retirada si la intensidad aumenta',
        'Activación de recursos adicionales regionales'
      ],
      criticalFactors: [
        'Cambios en dirección del viento',
        'Disponibilidad de agua',
        'Estado de las comunicaciones',
        'Condiciones de visibilidad'
      ]
    }
  }

  private async createOffensiveStrategy(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    riskAssessment: any
  ): Promise<TacticalPlan> {
    return {
      id: 'offensive_001',
      name: 'Estrategia Ofensiva - Ataque Directo Agresivo',
      priority: 8,
      riskLevel: 'high',
      personnelRequired: 65,
      equipmentRequired: [
        '12 Autobombas Forestales',
        '6 Camiones Cisterna',
        '4 Helicópteros de Extinción',
        '2 Aviones Anfibios',
        '3 Bulldozers',
        'Equipos de Protección Avanzada'
      ],
      estimatedDuration: 8,
      successProbability: 0.65,
      casualties: {
        civilianRisk: 0.02,
        firefighterRisk: 0.35,
        environmentalImpact: 0.4
      },
      phases: [
        {
          phase: 1,
          name: 'Ataque Inicial Coordinado',
          duration: 45,
          objectives: [
            'Ataque directo en cabeza del fuego',
            'Supresión de focos secundarios',
            'Control de flancos activos'
          ],
          resources: [
            {
              type: 'ground_crew',
              units: 8,
              location: fireLocation,
              assignment: 'Ataque directo con líneas de manguera',
              communicationChannel: 'Canal 3 - Ataque',
              escapeRoutes: ['Ruta de Escape Norte', 'Ruta de Escape Sur'],
              safetyZones: ['Zona Quemada Segura', 'Área Rocosa']
            },
            {
              type: 'aerial',
              units: 4,
              location: fireLocation,
              assignment: 'Descarga masiva en cabeza de fuego',
              communicationChannel: 'Canal 4 - Aéreo Pesado',
              escapeRoutes: ['Base Aérea Principal'],
              safetyZones: ['Helipuerto Emergencia']
            }
          ],
          safetyMeasures: [
            'Equipos de protección completa obligatoria',
            'Vigilantes de seguridad en cada flanco',
            'Comunicación continua con comando',
            'Monitoreo de escape routes cada 5 minutos'
          ],
          successCriteria: [
            'Reducción del 60% en intensidad del fuego',
            'Control de propagación frontal',
            'Sin bajas de personal'
          ],
          fallbackOptions: [
            'Transición a estrategia defensiva',
            'Retirada inmediata si cambian condiciones'
          ]
        }
      ],
      contingencyPlans: [
        'Retirada inmediata si viento supera 25 km/h',
        'Transición a ataque indirecto si fracasa fase inicial',
        'Evacuación aérea de personal si es necesario'
      ],
      criticalFactors: [
        'Velocidad y dirección del viento',
        'Disponibilidad de agua continua',
        'Coordinación aire-tierra',
        'Estado físico del personal'
      ]
    }
  }

  private async createIndirectAttackStrategy(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    riskAssessment: any
  ): Promise<TacticalPlan> {
    return {
      id: 'indirect_001',
      name: 'Estrategia de Ataque Indirecto - Contención Perimetral',
      priority: 9,
      riskLevel: 'moderate',
      personnelRequired: 55,
      equipmentRequired: [
        '10 Autobombas Forestales',
        '4 Camiones Cisterna',
        '6 Bulldozers',
        '2 Helicópteros de Transporte',
        '3 Unidades de Comando',
        'Equipos de Construcción de Líneas'
      ],
      estimatedDuration: 16,
      successProbability: 0.75,
      casualties: {
        civilianRisk: 0.03,
        firefighterRisk: 0.25,
        environmentalImpact: 0.6
      },
      phases: [
        {
          phase: 1,
          name: 'Construcción de Líneas de Contención',
          duration: 120,
          objectives: [
            'Construir líneas de contención a distancia segura',
            'Eliminar combustible en líneas de control',
            'Establecer puntos de anclaje seguros'
          ],
          resources: [
            {
              type: 'heavy_equipment',
              units: 6,
              location: fireLocation,
              assignment: 'Construcción de cortafuegos',
              communicationChannel: 'Canal 5 - Maquinaria',
              escapeRoutes: ['Carretera de Servicio', 'Camino de Acceso'],
              safetyZones: ['Zona Despejada Norte', 'Área de Maniobras']
            }
          ],
          safetyMeasures: [
            'Distancia mínima de 200m del fuego activo',
            'Monitoreo continuo de comportamiento del fuego',
            'Equipos de rescate en standby'
          ],
          successCriteria: [
            'Líneas de contención completadas',
            'Combustible eliminado en 90%',
            'Puntos de anclaje seguros establecidos'
          ],
          fallbackOptions: [
            'Ampliación de distancia de seguridad',
            'Uso de retardante químico'
          ]
        },
        {
          phase: 2,
          name: 'Operaciones de Burnout Controlado',
          duration: 240,
          objectives: [
            'Quemar combustible entre líneas y fuego',
            'Crear zona buffer amplia',
            'Fortalecer líneas de contención'
          ],
          resources: [
            {
              type: 'ground_crew',
              units: 4,
              location: fireLocation,
              assignment: 'Operaciones de quema controlada',
              communicationChannel: 'Canal 6 - Burnout',
              escapeRoutes: ['Línea de Contención', 'Zona Quemada'],
              safetyZones: ['Área Rocosa', 'Zona Húmeda']
            }
          ],
          safetyMeasures: [
            'Condiciones meteorológicas estables requeridas',
            'Personal especializado en quemas controladas',
            'Equipos de extinción en standby'
          ],
          successCriteria: [
            'Burnout completado exitosamente',
            'Zona buffer de 100m establecida',
            'Sin escape de fuego controlado'
          ],
          fallbackOptions: [
            'Suspensión de burnout si cambian condiciones',
            'Extinción inmediata si pierde control'
          ]
        }
      ],
      contingencyPlans: [
        'Suspensión de operaciones si viento supera 20 km/h',
        'Transición a estrategia defensiva si burnout falla',
        'Evacuación de personal de líneas si fuego salta'
      ],
      criticalFactors: [
        'Estabilidad de condiciones meteorológicas',
        'Experiencia del personal en burnout',
        'Disponibilidad de maquinaria pesada',
        'Acceso a líneas de contención'
      ]
    }
  }

  private async createContainmentStrategy(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    riskAssessment: any
  ): Promise<TacticalPlan> {
    return {
      id: 'containment_001',
      name: 'Estrategia de Contención - Control de Perímetro',
      priority: 7,
      riskLevel: 'moderate',
      personnelRequired: 40,
      equipmentRequired: [
        '8 Autobombas Forestales',
        '3 Camiones Cisterna',
        '4 Bulldozers',
        '2 Helicópteros de Observación',
        'Equipos de Monitoreo Térmico'
      ],
      estimatedDuration: 20,
      successProbability: 0.80,
      casualties: {
        civilianRisk: 0.01,
        firefighterRisk: 0.20,
        environmentalImpact: 0.8
      },
      phases: [
        {
          phase: 1,
          name: 'Establecimiento de Perímetro de Contención',
          duration: 180,
          objectives: [
            'Definir perímetro de contención completo',
            'Establecer líneas de control en todo el perímetro',
            'Monitorear comportamiento del fuego'
          ],
          resources: [
            {
              type: 'ground_crew',
              units: 6,
              location: fireLocation,
              assignment: 'Patrullaje y mantenimiento de líneas',
              communicationChannel: 'Canal 7 - Perímetro',
              escapeRoutes: ['Múltiples rutas radiales'],
              safetyZones: ['Zonas despejadas cada 500m']
            }
          ],
          safetyMeasures: [
            'Patrullaje continuo del perímetro',
            'Detección temprana de escapes',
            'Comunicación horaria con comando'
          ],
          successCriteria: [
            'Perímetro 100% establecido',
            'Sin escapes detectados',
            'Líneas de control efectivas'
          ],
          fallbackOptions: [
            'Refuerzo de sectores débiles',
            'Ampliación de perímetro si necesario'
          ]
        }
      ],
      contingencyPlans: [
        'Refuerzo inmediato si fuego escapa perímetro',
        'Ampliación de líneas si fuego crece',
        'Transición a estrategia ofensiva si condiciones mejoran'
      ],
      criticalFactors: [
        'Integridad de líneas de contención',
        'Detección temprana de escapes',
        'Disponibilidad de recursos de refuerzo',
        'Condiciones meteorológicas estables'
      ]
    }
  }

  private async createControlledBurnStrategy(
    fireLocation: { latitude: number, longitude: number },
    windAnalysis: any,
    riskAssessment: any
  ): Promise<TacticalPlan> {
    return {
      id: 'controlled_burn_001',
      name: 'Estrategia de Quema Controlada - Reducción de Combustible',
      priority: 6,
      riskLevel: 'high',
      personnelRequired: 35,
      equipmentRequired: [
        '6 Autobombas Forestales',
        '2 Camiones Cisterna',
        '1 Helicóptero de Ignición',
        'Equipos de Ignición Terrestre',
        'Equipos Meteorológicos Portátiles'
      ],
      estimatedDuration: 24,
      successProbability: 0.70,
      casualties: {
        civilianRisk: 0.02,
        firefighterRisk: 0.30,
        environmentalImpact: 0.5
      },
      phases: [
        {
          phase: 1,
          name: 'Preparación de Área de Quema',
          duration: 120,
          objectives: [
            'Establecer líneas de control para quema',
            'Verificar condiciones meteorológicas',
            'Preparar equipos de extinción'
          ],
          resources: [
            {
              type: 'ground_crew',
              units: 4,
              location: fireLocation,
              assignment: 'Preparación de líneas de quema',
              communicationChannel: 'Canal 8 - Quema Controlada',
              escapeRoutes: ['Líneas de Control', 'Zonas Seguras'],
              safetyZones: ['Áreas Húmedas', 'Zonas Rocosas']
            }
          ],
          safetyMeasures: [
            'Condiciones meteorológicas dentro de parámetros',
            'Personal especializado únicamente',
            'Equipos de extinción posicionados'
          ],
          successCriteria: [
            'Líneas de control establecidas',
            'Condiciones meteorológicas apropiadas',
            'Equipos de seguridad posicionados'
          ],
          fallbackOptions: [
            'Postponer quema si condiciones no son ideales',
            'Reducir área de quema si es necesario'
          ]
        }
      ],
      contingencyPlans: [
        'Extinción inmediata si quema escapa control',
        'Suspensión si condiciones meteorológicas cambian',
        'Evacuación de área si operación falla'
      ],
      criticalFactors: [
        'Condiciones meteorológicas precisas',
        'Experiencia del personal en quemas',
        'Disponibilidad de recursos de extinción',
        'Comunicación constante con meteorología'
      ]
    }
  }

  private generateWaterSources(
    fireLocation: { latitude: number, longitude: number },
    radius: number
  ): WaterSource[] {
    return [
      {
        id: 'river_001',
        type: 'natural',
        location: { 
          latitude: fireLocation.latitude + 0.01, 
          longitude: fireLocation.longitude + 0.02 
        },
        capacity: 1000000,
        flowRate: 5000,
        accessibility: 'good',
        distance: 2.3,
        setupTime: 15,
        reliability: 0.95
      },
      {
        id: 'reservoir_001',
        type: 'artificial',
        location: { 
          latitude: fireLocation.latitude - 0.02, 
          longitude: fireLocation.longitude + 0.01 
        },
        capacity: 500000,
        flowRate: 3000,
        accessibility: 'excellent',
        distance: 3.1,
        setupTime: 10,
        reliability: 0.98
      },
      {
        id: 'pond_001',
        type: 'natural',
        location: { 
          latitude: fireLocation.latitude + 0.005, 
          longitude: fireLocation.longitude - 0.015 
        },
        capacity: 50000,
        flowRate: 800,
        accessibility: 'difficult',
        distance: 1.8,
        setupTime: 25,
        reliability: 0.85
      },
      {
        id: 'mobile_tank_001',
        type: 'mobile',
        location: fireLocation,
        capacity: 20000,
        flowRate: 1200,
        accessibility: 'excellent',
        distance: 0.5,
        setupTime: 5,
        reliability: 0.90
      }
    ]
  }

  private identifyNaturalFirebreaks(
    fireLocation: { latitude: number, longitude: number },
    windDirection: number
  ): FirebreakStrategy[] {
    return [
      {
        id: 'natural_road_001',
        type: 'natural',
        location: [
          { latitude: fireLocation.latitude + 0.01, longitude: fireLocation.longitude },
          { latitude: fireLocation.latitude + 0.01, longitude: fireLocation.longitude + 0.02 }
        ],
        width: 20,
        length: 2000,
        constructionTime: 0,
        effectiveness: 0.85,
        environmentalImpact: 'minimal',
        riskToPersonnel: 'low'
      }
    ]
  }

  private designConstructedFirebreaks(
    fireLocation: { latitude: number, longitude: number },
    windDirection: number
  ): FirebreakStrategy[] {
    return [
      {
        id: 'constructed_001',
        type: 'constructed',
        location: [
          { latitude: fireLocation.latitude, longitude: fireLocation.longitude + 0.01 },
          { latitude: fireLocation.latitude + 0.02, longitude: fireLocation.longitude + 0.01 }
        ],
        width: 30,
        length: 2500,
        constructionTime: 4,
        effectiveness: 0.90,
        environmentalImpact: 'moderate',
        riskToPersonnel: 'moderate'
      }
    ]
  }

  private designBurnoutOperations(
    fireLocation: { latitude: number, longitude: number },
    windDirection: number
  ): FirebreakStrategy[] {
    return [
      {
        id: 'burnout_001',
        type: 'burnout',
        location: [
          { latitude: fireLocation.latitude - 0.005, longitude: fireLocation.longitude },
          { latitude: fireLocation.latitude - 0.005, longitude: fireLocation.longitude + 0.015 }
        ],
        width: 50,
        length: 1500,
        constructionTime: 6,
        effectiveness: 0.95,
        environmentalImpact: 'moderate',
        riskToPersonnel: 'high'
      }
    ]
  }

  private designBackfireOperations(
    fireLocation: { latitude: number, longitude: number },
    windDirection: number
  ): FirebreakStrategy[] {
    return [
      {
        id: 'backfire_001',
        type: 'backfire',
        location: [
          { latitude: fireLocation.latitude + 0.02, longitude: fireLocation.longitude - 0.01 },
          { latitude: fireLocation.latitude + 0.02, longitude: fireLocation.longitude + 0.01 }
        ],
        width: 100,
        length: 2000,
        constructionTime: 8,
        effectiveness: 0.98,
        environmentalImpact: 'significant',
        riskToPersonnel: 'extreme'
      }
    ]
  }
}

export const tacticalFirefightingService = new TacticalFirefightingService()
export type { TacticalPlan, TacticalPhase, ResourceDeployment, WaterSource, FirebreakStrategy }