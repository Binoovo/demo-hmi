import { Component, OnInit } from '@angular/core';
import { MockDataService, Variable, AlarmConfig, AlarmGroup } from '../../services/mock-data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-variables-config',
  templateUrl: './variables-config.component.html',
  styleUrls: ['./variables-config.component.scss']
})
export class VariablesConfigComponent implements OnInit {
  allVariables: Variable[] = [];
  alarmConfigs: AlarmConfig[] = [];
  searchText: string = '';
  showUpdateModal: boolean = false;
  selectedVariable: any = null;

  gruposAlarmas: { label: string; value: string }[] = [];

  iconOptions = [
    { label: 'Sin icono', value: '', icon: '' },
    { label: '⚡ Bolt', value: 'pi pi-bolt', icon: 'pi pi-bolt' },
    { label: '🔌 Power', value: 'pi pi-power-off', icon: 'pi pi-power-off' },
    { label: '📊 Chart', value: 'pi pi-chart-line', icon: 'pi pi-chart-line' },
    { label: '⚙️ Cog', value: 'pi pi-cog', icon: 'pi pi-cog' },
    { label: '📈 Trending Up', value: 'pi pi-arrow-up', icon: 'pi pi-arrow-up' },
    { label: '🌡️ Temperature', value: 'pi pi-thermometer', icon: 'pi pi-thermometer' },
    { label: '💡 Lightbulb', value: 'fa fa-lightbulb', icon: 'fa fa-lightbulb' },
    { label: '⚠️ Warning', value: 'pi pi-exclamation-triangle', icon: 'pi pi-exclamation-triangle' }
  ];

  unitOptions = [
    { label: 'Volt', value: 'V' },
    { label: 'Ampere', value: 'A' },
    { label: 'Watt', value: 'W' },
    { label: 'kW', value: 'kW' },
    { label: 'kVAr', value: 'kVAr' },
    { label: 'Hz', value: 'Hz' },
    { label: '°C', value: '°C' },
    { label: 'Sin unidad', value: '' }
  ];

  dataTypeOptions = [
    { label: 'Double', value: 'voltage' },
    { label: 'Boolean', value: 'digital' },
    { label: 'Integer', value: 'integer' }
  ];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadAllVariables();
    this.loadAlarmConfigs();
    this.loadAlarmGroups();
  }

  loadAllVariables(): void {
    this.mockDataService.getVariables()
      .pipe(take(1))
      .subscribe(variables => {
        // Aplicar datos guardados de localStorage sobre las variables del servicio
        const savedVariables = this.loadVariablesFromLocalStorage();
        this.allVariables = variables.map(variable => {
          const savedVar = savedVariables.find((v: any) => v.id === variable.id);
          if (savedVar) {
            return {
              ...variable,
              unidad: savedVar.unidad !== undefined ? savedVar.unidad : variable.unidad,
              tipo: savedVar.tipo !== undefined ? savedVar.tipo : variable.tipo,
              grupoAlarma: savedVar.grupoAlarma,
              icon: savedVar.icon
            };
          }
          return variable;
        });
      });
  }

  getEntityName(entityId: number): string {
    try {
      const savedEntities = localStorage.getItem('hmi-entities-config');
      if (savedEntities) {
        const entities = JSON.parse(savedEntities);
        const entity = entities.find((e: any) => e.id === entityId);
        if (entity) {
          return entity.description;
        }
      }
    } catch (error) {
      console.error('Error loading entity name:', error);
    }

    // Valores por defecto
    const entityNames: { [key: number]: string } = {
      1: 'Oficina',
      2: 'General Taller',
      3: 'Vestuarios Despachos'
    };
    return entityNames[entityId] || 'Desconocido';
  }

  getVariableTagPLC(variable: Variable): string {
    return `ns=1;s=MyDevice.${variable.nombre}`;
  }

  getServerConnection(): string {
    return 'opc.tcp://localhost:49320';
  }

  getDataType(tipo: string): string {
    // Mapear tipos a nombres más descriptivos
    const typeMap: { [key: string]: string } = {
      'voltage': 'Double',
      'current': 'Double',
      'power': 'Double',
      'temperature': 'Double',
      'frequency': 'Double',
      'factor': 'Double',
      'digital': 'Boolean'
    };
    return typeMap[tipo] || 'Double';
  }

  openUpdateModal(variable: Variable): void {
    // Cargar datos desde localStorage
    const savedVariables = this.loadVariablesFromLocalStorage();
    const savedVar = savedVariables.find((v: any) => v.id === variable.id);

    this.selectedVariable = {
      ...variable,
      unidad: savedVar?.unidad !== undefined ? savedVar.unidad : variable.unidad,
      tipo: savedVar?.tipo !== undefined ? savedVar.tipo : variable.tipo,
      grupoAlarma: savedVar?.grupoAlarma || (this.gruposAlarmas.length > 0 ? this.gruposAlarmas[0].value : ''),
      icon: savedVar?.icon !== undefined ? savedVar.icon : ''
    };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedVariable = null;
  }

  updateVariable(): void {
    if (this.selectedVariable) {
      // Guardar en localStorage
      this.saveVariableToLocalStorage(this.selectedVariable);

      // Recargar la lista completa para aplicar los cambios de localStorage
      this.loadAllVariables();

      this.closeUpdateModal();
    }
  }

  private loadVariablesFromLocalStorage(): any[] {
    try {
      const saved = localStorage.getItem('hmi-variables-config');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading variables config:', error);
      return [];
    }
  }

  private saveVariableToLocalStorage(variable: any): void {
    try {
      let savedVariables = this.loadVariablesFromLocalStorage();

      // Actualizar o agregar la variable
      const index = savedVariables.findIndex((v: any) => v.id === variable.id);
      if (index !== -1) {
        savedVariables[index] = {
          id: variable.id,
          nombre: variable.nombre,
          unidad: variable.unidad,
          tipo: variable.tipo,
          grupoAlarma: variable.grupoAlarma,
          icon: variable.icon
        };
      } else {
        savedVariables.push({
          id: variable.id,
          nombre: variable.nombre,
          unidad: variable.unidad,
          tipo: variable.tipo,
          grupoAlarma: variable.grupoAlarma,
          icon: variable.icon
        });
      }

      localStorage.setItem('hmi-variables-config', JSON.stringify(savedVariables));
    } catch (error) {
      console.error('Error saving variable config:', error);
    }
  }

  loadAlarmConfigs(): void {
    this.mockDataService.getAlarmConfigs()
      .pipe(take(1))
      .subscribe(configs => {
        this.alarmConfigs = configs;
      });
  }

  loadAlarmGroups(): void {
    this.mockDataService.getAlarmGroups()
      .pipe(take(1))
      .subscribe(groups => {
        this.gruposAlarmas = groups.map(group => ({
          label: group.etiqueta,
          value: group.etiqueta
        }));
      });
  }

  onGlobalFilterAlarms(table: any, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    table.filterGlobal(inputElement.value, 'contains');
  }
}
