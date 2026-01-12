import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Variable {
  id: number;
  nombre: string;
  valor: number;
  unidad: string;
  tipo: string;
  descripcion: string;
  monitoring: boolean;
  selected: boolean;  // Marca si la variable está seleccionada para historizar
  entityId: number;
  grupoAlarma?: string;
  icon?: string;
}

export interface EntityData {
  entityId: number;
  entityName: string;
  hasAlarm: boolean;
  variables: Variable[];
}

export interface PlcData {
  plcId: number;
  plcNombre: string;
  estado: 'Conectado' | 'Desconectado';
  variables: Variable[];
}

export interface AlarmData {
  id: number;
  variableNombre: string;
  mensaje: string;
  severidad: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  activa: boolean;
}

export interface AlarmConfig {
  id: number;
  name: string;
  condition: string;
  sendEmail: boolean;
  variableId: number;
  variableName: string;
}

export interface AlarmGroup {
  id: number;
  etiqueta: string;
  id_groupCorreos: number;
}

export interface HistoricalData {
  id: number;
  date: Date;
  desc_variable: string;
  plcValue: number;
  unidad: string;
  desc_entity: string;
}

export interface HistoricalAlarm {
  id: number;
  date: Date;
  alarma: string;
  desc_variable: string;
  plcValue: number;
  unidad: string;
  desc_entity: string;
  isActive: boolean;
  acknowledged: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private variablesSubject = new BehaviorSubject<Variable[]>([]);
  public variables$ = this.variablesSubject.asObservable();

  private alarmsSubject = new BehaviorSubject<AlarmData[]>([]);
  public alarms$ = this.alarmsSubject.asObservable();

  private historicalAlarmsSubject = new BehaviorSubject<HistoricalAlarm[]>([]);
  public historicalAlarms$ = this.historicalAlarmsSubject.asObservable();

  private mockVariables: Variable[] = [
    // Voltajes Oficina (VCD) - entityId: 1
    { id: 1, nombre: 'L3-L1(VCD)', valor: 331, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L3-L1 Oficina', monitoring: true, selected: true, entityId: 1 },
    { id: 2, nombre: 'L2-L3(VCD)', valor: 366, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L2-L3 Oficina', monitoring: true, selected: false, entityId: 1 },
    { id: 3, nombre: 'L1-L2(VCD)', valor: 328, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L1-L2 Oficina', monitoring: true, selected: false, entityId: 1 },

    // Voltajes General Taller (GT) - entityId: 2
    { id: 4, nombre: 'L3-L1(GT)', valor: 374, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L3-L1 General Taller', monitoring: true, selected: true, entityId: 2 },
    { id: 5, nombre: 'L2-L3(GT)', valor: 346, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L2-L3 General Taller', monitoring: true, selected: false, entityId: 2 },
    { id: 6, nombre: 'L1-L2(GT)', valor: 383, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L1-L2 General Taller', monitoring: true, selected: false, entityId: 2 },

    // Voltajes Vestuarios (OFI) - entityId: 3
    { id: 7, nombre: 'L3-L1(OFI)', valor: 323, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L3-L1 Vestuarios', monitoring: true, selected: true, entityId: 3 },
    { id: 8, nombre: 'L2-L3(OFI)', valor: 393, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L2-L3 Vestuarios', monitoring: true, selected: false, entityId: 3 },
    { id: 9, nombre: 'L1-L2(OFI)', valor: 390, unidad: 'V', tipo: 'voltage', descripcion: 'Voltaje L1-L2 Vestuarios', monitoring: true, selected: false, entityId: 3 },

    // Corrientes - entityId: 1 (Oficina)
    { id: 10, nombre: 'Corriente_L1', valor: 25.5, unidad: 'A', tipo: 'current', descripcion: 'Corriente en línea 1', monitoring: true, selected: false, entityId: 1 },
    { id: 11, nombre: 'Corriente_L2', valor: 26.2, unidad: 'A', tipo: 'current', descripcion: 'Corriente en línea 2', monitoring: true, selected: false, entityId: 1 },
    { id: 12, nombre: 'Corriente_L3', valor: 27.8, unidad: 'A', tipo: 'current', descripcion: 'Corriente en línea 3', monitoring: true, selected: false, entityId: 1 },
    { id: 13, nombre: 'Corriente_Neutro', valor: 2.5, unidad: 'A', tipo: 'current', descripcion: 'Corriente en neutro', monitoring: true, selected: false, entityId: 1 },

    // Potencias - entityId: 1 (Oficina)
    { id: 14, nombre: 'Potencia_Activa_L1', valor: 12.5, unidad: 'kW', tipo: 'power', descripcion: 'Potencia activa línea 1', monitoring: true, selected: false, entityId: 1 },
    { id: 15, nombre: 'Potencia_Activa_L2', valor: 13.2, unidad: 'kW', tipo: 'power', descripcion: 'Potencia activa línea 2', monitoring: true, selected: false, entityId: 1 },
    { id: 16, nombre: 'Potencia_Activa_L3', valor: 14.8, unidad: 'kW', tipo: 'power', descripcion: 'Potencia activa línea 3', monitoring: true, selected: false, entityId: 1 },
    { id: 17, nombre: 'Potencia_Reactiva_L1', valor: 5.2, unidad: 'kVAr', tipo: 'power', descripcion: 'Potencia reactiva línea 1', monitoring: true, selected: false, entityId: 1 },
    { id: 18, nombre: 'Potencia_Reactiva_L2', valor: 5.8, unidad: 'kVAr', tipo: 'power', descripcion: 'Potencia reactiva línea 2', monitoring: true, selected: false, entityId: 1 },
    { id: 19, nombre: 'Potencia_Reactiva_L3', valor: 6.5, unidad: 'kVAr', tipo: 'power', descripcion: 'Potencia reactiva línea 3', monitoring: true, selected: false, entityId: 1 },
    { id: 20, nombre: 'Potencia_Total', valor: 40.5, unidad: 'kW', tipo: 'power', descripcion: 'Potencia activa total', monitoring: true, selected: false, entityId: 1 },

    // Otros - entityId: 1 (Oficina)
    { id: 21, nombre: 'Factor_Potencia', valor: 0.92, unidad: '', tipo: 'factor', descripcion: 'Factor de potencia', monitoring: true, selected: false, entityId: 1 },
    { id: 22, nombre: 'Frecuencia', valor: 50.0, unidad: 'Hz', tipo: 'frequency', descripcion: 'Frecuencia de red', monitoring: false, selected: false, entityId: 1 },
    { id: 23, nombre: 'Temperatura_Motor', valor: 65.5, unidad: '°C', tipo: 'temperature', descripcion: 'Temperatura del motor', monitoring: false, selected: false, entityId: 1 },
    { id: 24, nombre: 'Estado_Bomba', valor: 1, unidad: '', tipo: 'digital', descripcion: 'Estado bomba (1=ON, 0=OFF)', monitoring: false, selected: false, entityId: 1 }
  ];

  private mockAlarms: AlarmData[] = [
    {
      id: 1,
      variableNombre: 'Temperatura_Motor',
      mensaje: 'Temperatura del motor alta (>65°C)',
      severidad: 'medium',
      timestamp: new Date(Date.now() - 3600000),
      activa: true
    },
    {
      id: 2,
      variableNombre: 'Factor_Potencia',
      mensaje: 'Factor de potencia bajo (<0.95)',
      severidad: 'low',
      timestamp: new Date(Date.now() - 7200000),
      activa: true
    }
  ];

  private mockAlarmConfigs: AlarmConfig[] = [
    {
      id: 1,
      name: 'Temperatura alta',
      condition: 'value > 65',
      sendEmail: true,
      variableId: 23,
      variableName: 'Temperatura del motor'
    },
    {
      id: 2,
      name: 'Factor potencia bajo',
      condition: 'value < 0.95',
      sendEmail: true,
      variableId: 21,
      variableName: 'Factor de potencia'
    },
    {
      id: 3,
      name: 'Voltaje fuera de rango',
      condition: 'value > 420 OR value < 380',
      sendEmail: false,
      variableId: 1,
      variableName: 'L3-L1(VCD)'
    },
    {
      id: 4,
      name: 'Corriente alta',
      condition: 'value > 30',
      sendEmail: true,
      variableId: 10,
      variableName: 'Corriente_L1'
    }
  ];

  private mockAlarmGroups: AlarmGroup[] = [
    {
      id: 1,
      etiqueta: 'Alarmas Críticas',
      id_groupCorreos: 1
    },
    {
      id: 2,
      etiqueta: 'Alarmas de Temperatura',
      id_groupCorreos: 2
    },
    {
      id: 3,
      etiqueta: 'Alarmas de Voltaje',
      id_groupCorreos: 1
    }
  ];

  private mockHistoricalAlarms: HistoricalAlarm[] = [
    {
      id: 1,
      date: new Date(Date.now() - 3600000),
      alarma: 'Temperatura alta',
      desc_variable: 'Temperatura del motor',
      plcValue: 68.5,
      unidad: '°C',
      desc_entity: 'Oficina',
      isActive: true,
      acknowledged: false
    },
    {
      id: 2,
      date: new Date(Date.now() - 7200000),
      alarma: 'Factor potencia bajo',
      desc_variable: 'Factor de potencia',
      plcValue: 0.89,
      unidad: '',
      desc_entity: 'Oficina',
      isActive: true,
      acknowledged: true
    },
    {
      id: 3,
      date: new Date(Date.now() - 10800000),
      alarma: 'Voltaje fuera de rango',
      desc_variable: 'Voltaje L3-L1 Oficina',
      plcValue: 425,
      unidad: 'V',
      desc_entity: 'Oficina',
      isActive: false,
      acknowledged: true
    },
    {
      id: 4,
      date: new Date(Date.now() - 14400000),
      alarma: 'Corriente alta',
      desc_variable: 'Corriente en línea 1',
      plcValue: 32.5,
      unidad: 'A',
      desc_entity: 'Oficina',
      isActive: false,
      acknowledged: true
    },
    {
      id: 5,
      date: new Date(Date.now() - 18000000),
      alarma: 'Temperatura alta',
      desc_variable: 'Temperatura del motor',
      plcValue: 72.0,
      unidad: '°C',
      desc_entity: 'Oficina',
      isActive: false,
      acknowledged: true
    }
  ];

  constructor() {
    // Cargar configuraciones de monitoring y selected desde localStorage
    this.loadMonitoringFromLocalStorage();
    this.loadSelectedFromLocalStorage();

    // Inicializar valores
    this.variablesSubject.next([...this.mockVariables]);
    this.alarmsSubject.next([...this.mockAlarms]);
    this.historicalAlarmsSubject.next([...this.mockHistoricalAlarms]);

    // Simular actualizaciones en tiempo real cada 2 segundos
    this.startRealTimeSimulation();
  }

  private loadMonitoringFromLocalStorage(): void {
    try {
      const savedMonitoring = localStorage.getItem('hmi-variable-monitoring');
      if (savedMonitoring) {
        const monitoringState: { [key: number]: boolean } = JSON.parse(savedMonitoring);

        // Actualizar el estado de monitoring de cada variable
        this.mockVariables = this.mockVariables.map(variable => ({
          ...variable,
          monitoring: monitoringState[variable.id] !== undefined
            ? monitoringState[variable.id]
            : variable.monitoring
        }));
      }
    } catch (error) {
      console.error('Error loading monitoring state from localStorage:', error);
    }
  }

  private saveMonitoringToLocalStorage(): void {
    try {
      const monitoringState: { [key: number]: boolean } = {};
      this.mockVariables.forEach(variable => {
        monitoringState[variable.id] = variable.monitoring;
      });
      localStorage.setItem('hmi-variable-monitoring', JSON.stringify(monitoringState));
    } catch (error) {
      console.error('Error saving monitoring state to localStorage:', error);
    }
  }

  private loadSelectedFromLocalStorage(): void {
    try {
      const savedSelected = localStorage.getItem('hmi-variable-selected');
      console.log('[MockDataService] Cargando desde localStorage:', savedSelected);

      if (savedSelected) {
        const selectedState: { [key: number]: boolean } = JSON.parse(savedSelected);
        console.log('[MockDataService] Estado cargado:', selectedState);

        // Actualizar el estado de selected de cada variable
        this.mockVariables = this.mockVariables.map(variable => ({
          ...variable,
          selected: selectedState[variable.id] !== undefined
            ? selectedState[variable.id]
            : variable.selected
        }));

        console.log('[MockDataService] Variables con selected=true después de cargar:',
          this.mockVariables.filter(v => v.selected).map(v => v.id));
      } else {
        console.log('[MockDataService] No hay datos guardados en localStorage');
      }
    } catch (error) {
      console.error('Error loading selected state from localStorage:', error);
    }
  }

  private saveSelectedToLocalStorage(): void {
    try {
      const selectedState: { [key: number]: boolean } = {};
      this.mockVariables.forEach(variable => {
        selectedState[variable.id] = variable.selected;
      });
      localStorage.setItem('hmi-variable-selected', JSON.stringify(selectedState));
    } catch (error) {
      console.error('Error saving selected state to localStorage:', error);
    }
  }

  private startRealTimeSimulation(): void {
    interval(2000).subscribe(() => {
      const updatedVariables = this.mockVariables.map(variable => {
        // Generar variaciones aleatorias pequeñas
        let variation = 0;

        switch (variable.tipo) {
          case 'voltage':
            variation = (Math.random() - 0.5) * 4; // ±2V
            break;
          case 'current':
            variation = (Math.random() - 0.5) * 2; // ±1A
            break;
          case 'power':
            variation = (Math.random() - 0.5) * 1; // ±0.5kW
            break;
          case 'temperature':
            variation = (Math.random() - 0.5) * 3; // ±1.5°C
            break;
          case 'frequency':
            variation = (Math.random() - 0.5) * 0.2; // ±0.1Hz
            break;
          case 'factor':
            variation = (Math.random() - 0.5) * 0.04; // ±0.02
            break;
          case 'digital':
            // Digital mantiene valor con pequeña probabilidad de cambio
            if (Math.random() < 0.05) {
              return { ...variable, valor: variable.valor === 1 ? 0 : 1 };
            }
            return variable;
          default:
            variation = 0;
        }

        const newValue = variable.valor + variation;
        return { ...variable, valor: parseFloat(newValue.toFixed(2)) };
      });

      this.mockVariables = updatedVariables;
      this.variablesSubject.next([...updatedVariables]);
    });
  }

  // Métodos públicos
  getVariables(): Observable<Variable[]> {
    return this.variables$;
  }

  getVariableById(id: number): Observable<Variable | undefined> {
    return this.variables$.pipe(
      map(variables => variables.find(v => v.id === id))
    );
  }

  getVariablesByType(type: string): Observable<Variable[]> {
    return this.variables$.pipe(
      map(variables => variables.filter(v => v.tipo === type))
    );
  }

  getPlcData(): Observable<PlcData[]> {
    return this.variables$.pipe(
      map(variables => [
        {
          plcId: 1,
          plcNombre: 'PLC Principal',
          estado: 'Conectado',
          variables: variables.filter(v => v.id <= 10)
        },
        {
          plcId: 2,
          plcNombre: 'PLC Secundario',
          estado: 'Conectado',
          variables: variables.filter(v => v.id > 10)
        }
      ])
    );
  }

  private getEntityConfig(): Map<number, { description: string; color: string }> {
    const config = new Map<number, { description: string; color: string }>();

    try {
      const savedEntities = localStorage.getItem('hmi-entities-config');
      if (savedEntities) {
        const entities = JSON.parse(savedEntities);
        entities.forEach((entity: any) => {
          config.set(entity.id, { description: entity.description, color: entity.color });
        });
      }
    } catch (error) {
      console.error('Error loading entity config:', error);
    }

    // Valores por defecto si no hay configuración guardada
    if (config.size === 0) {
      config.set(1, { description: 'Oficina', color: '#2196F3' });
      config.set(2, { description: 'General Taller', color: '#4CAF50' });
      config.set(3, { description: 'Vestuarios Despachos', color: '#FF9800' });
    }

    return config;
  }

  getEntityData(): Observable<EntityData[]> {
    return this.variables$.pipe(
      map(variables => {
        const entityConfig = this.getEntityConfig();

        return [
          {
            entityId: 1,
            entityName: entityConfig.get(1)?.description || 'Oficina',
            hasAlarm: false,
            variables: variables.filter(v => v.entityId === 1 && v.monitoring)
          },
          {
            entityId: 2,
            entityName: entityConfig.get(2)?.description || 'General Taller',
            hasAlarm: false,
            variables: variables.filter(v => v.entityId === 2 && v.monitoring)
          },
          {
            entityId: 3,
            entityName: entityConfig.get(3)?.description || 'Vestuarios Despachos',
            hasAlarm: false,
            variables: variables.filter(v => v.entityId === 3 && v.monitoring)
          }
        ];
      })
    );
  }

  getVariablesByEntity(entityId: number): Observable<Variable[]> {
    return this.variables$.pipe(
      map(variables => variables.filter(v => v.entityId === entityId))
    );
  }

  updateVariableMonitoring(variableIds: number[], monitoring: boolean): void {
    this.mockVariables = this.mockVariables.map(variable =>
      variableIds.includes(variable.id) ? { ...variable, monitoring } : variable
    );
    this.variablesSubject.next([...this.mockVariables]);

    // Guardar en localStorage
    this.saveMonitoringToLocalStorage();
  }

  getAlarms(): Observable<AlarmData[]> {
    return this.alarms$;
  }

  getActiveAlarms(): Observable<AlarmData[]> {
    return this.alarms$.pipe(
      map(alarms => alarms.filter(a => a.activa))
    );
  }

  acknowledgeAlarm(alarmId: number): void {
    const alarms = this.alarmsSubject.value;
    const updatedAlarms = alarms.map(alarm =>
      alarm.id === alarmId ? { ...alarm, activa: false } : alarm
    );
    this.alarmsSubject.next(updatedAlarms);
  }

  // Obtener datos históricos simulados para gráficos
  getHistoricalData(variableId: number, points: number = 20): Observable<{timestamp: Date, value: number}[]> {
    const variable = this.mockVariables.find(v => v.id === variableId);
    if (!variable) {
      return new Observable(observer => observer.next([]));
    }

    const data: {timestamp: Date, value: number}[] = [];
    const now = Date.now();
    const baseValue = variable.valor;

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now - (i * 5000)); // Cada 5 segundos
      const variation = (Math.random() - 0.5) * (baseValue * 0.1); // ±10% variación
      const value = parseFloat((baseValue + variation).toFixed(2));
      data.push({ timestamp, value });
    }

    return new Observable(observer => {
      observer.next(data);
      observer.complete();
    });
  }

  // Obtener registros históricos de variables
  getHistoricalVariables(): Observable<HistoricalData[]> {
    const entityConfig = this.getEntityConfig();
    const historicalData: HistoricalData[] = [];
    const now = Date.now();

    // Generar datos históricos solo para variables con selected=true
    const selectedVariables = this.mockVariables.filter(v => v.selected);

    selectedVariables.forEach((variable, index) => {
      // Generar 25 registros fijos por variable
      const numRecords = 25;

      for (let i = 0; i < numRecords; i++) {
        const timestamp = new Date(now - (i * 300000 + index * 60000)); // Cada 5 minutos
        const variation = (Math.random() - 0.5) * (variable.valor * 0.15);
        const value = parseFloat((variable.valor + variation).toFixed(2));

        historicalData.push({
          id: historicalData.length + 1,
          date: timestamp,
          desc_variable: variable.descripcion,
          plcValue: value,
          unidad: variable.unidad,
          desc_entity: entityConfig.get(variable.entityId)?.description || 'Desconocido'
        });
      }
    });

    // Ordenar por fecha descendente (más reciente primero)
    historicalData.sort((a, b) => b.date.getTime() - a.date.getTime());

    return new Observable(observer => {
      observer.next(historicalData);
      observer.complete();
    });
  }

  // Actualizar estado de selected (para historizar)
  updateVariableSelected(variableId: number, selected: boolean): void {
    console.log(`[MockDataService] Actualizando variable ${variableId} a selected=${selected}`);
    this.mockVariables = this.mockVariables.map(variable =>
      variable.id === variableId ? { ...variable, selected } : variable
    );
    this.saveSelectedToLocalStorage();
    console.log(`[MockDataService] Variables selected actuales:`, this.mockVariables.filter(v => v.selected).map(v => v.id));
    this.variablesSubject.next([...this.mockVariables]);
  }

  // Obtener variables marcadas para historizar
  getSelectedVariables(): Observable<Variable[]> {
    return this.variables$.pipe(
      map(variables => variables.filter(v => v.selected))
    );
  }

  // Obtener datos históricos de una variable específica para gráficos
  getHistoricalDataForChart(variableId: number): Observable<{timestamps: Date[], values: number[], variableName: string, unidad: string}> {
    const variable = this.mockVariables.find(v => v.id === variableId);
    if (!variable) {
      return new Observable(observer => {
        observer.next({timestamps: [], values: [], variableName: '', unidad: ''});
        observer.complete();
      });
    }

    const timestamps: Date[] = [];
    const values: number[] = [];
    const now = Date.now();
    const baseValue = variable.valor;

    // Generar 50 puntos de datos para el gráfico (últimas ~4 horas si son cada 5 minutos)
    for (let i = 49; i >= 0; i--) {
      const timestamp = new Date(now - (i * 300000)); // Cada 5 minutos
      const variation = (Math.random() - 0.5) * (baseValue * 0.15);
      const value = parseFloat((baseValue + variation).toFixed(2));

      timestamps.push(timestamp);
      values.push(value);
    }

    return new Observable(observer => {
      observer.next({
        timestamps,
        values,
        variableName: variable.descripcion,
        unidad: variable.unidad
      });
      observer.complete();
    });
  }

  // Obtener estructura de entidades y variables para cascadeSelect
  getEntitiesWithVariablesForChart(): Observable<any[]> {
    const entityConfig = this.getEntityConfig();
    const selectedVariables = this.mockVariables.filter(v => v.selected);
    console.log(`[MockDataService] getEntitiesWithVariablesForChart: ${selectedVariables.length} variables seleccionadas`, selectedVariables.map(v => `${v.id}:${v.nombre}`));

    // Agrupar variables por entidad
    const entitiesMap = new Map<number, Variable[]>();
    selectedVariables.forEach(variable => {
      if (!entitiesMap.has(variable.entityId)) {
        entitiesMap.set(variable.entityId, []);
      }
      entitiesMap.get(variable.entityId)!.push(variable);
    });

    // Construir estructura para cascadeSelect
    const entities: any[] = [];
    entitiesMap.forEach((variables, entityId) => {
      entities.push({
        desc_entity: entityConfig.get(entityId)?.description || `Entidad ${entityId}`,
        Variables: variables.map(v => ({
          id: v.id,
          des_variable: v.descripcion,
          unidad: v.unidad
        }))
      });
    });

    console.log(`[MockDataService] Retornando ${entities.length} entidades para cascadeSelect`);
    return new Observable(observer => {
      observer.next(entities);
      observer.complete();
    });
  }

  getHistoricalAlarms(): Observable<HistoricalAlarm[]> {
    return new Observable(observer => {
      observer.next([...this.mockHistoricalAlarms]);
      observer.complete();
    });
  }

  getAlarmConfigs(): Observable<AlarmConfig[]> {
    return new Observable(observer => {
      observer.next([...this.mockAlarmConfigs]);
      observer.complete();
    });
  }

  getAlarmGroups(): Observable<AlarmGroup[]> {
    return new Observable(observer => {
      observer.next([...this.mockAlarmGroups]);
      observer.complete();
    });
  }
}
