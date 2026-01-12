import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockDataService, Variable } from '../../services/mock-data.service';
import { MessageService } from 'primeng/api';
import { Subject, take, takeUntil } from 'rxjs';

interface VariableWithHistorical extends Variable {
  historicalEnabled?: boolean;
}

@Component({
  selector: 'app-variables-database',
  templateUrl: './variables-database.component.html',
  styleUrls: ['./variables-database.component.scss'],
  providers: [MessageService]
})
export class VariablesDatabaseComponent implements OnInit, OnDestroy {
  allVariables: VariableWithHistorical[] = [];
  selectedVariables: VariableWithHistorical[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private mockDataService: MockDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAllVariables();
  }

  loadAllVariables(): void {
    this.mockDataService.getVariables()
      .pipe(take(1)) // Solo tomar el primer valor, no suscribirse a actualizaciones continuas
      .subscribe(variables => {
        console.log('[VariablesDatabase] Cargando variables. Variables con selected=true:',
          variables.filter(v => v.selected).map(v => `${v.id}:${v.nombre}`));

        // Usar el campo 'selected' del servicio como fuente de verdad
        this.allVariables = variables.map(variable => ({
          ...variable,
          historicalEnabled: variable.selected
        }));

        // Pre-seleccionar las variables que ya están habilitadas
        this.selectedVariables = this.allVariables.filter(v => v.historicalEnabled);

        console.log('[VariablesDatabase] Variables pre-seleccionadas:',
          this.selectedVariables.map(v => `${v.id}:${v.nombre}`));
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

  getVariableUnit(variable: VariableWithHistorical): string {
    try {
      const savedVariables = localStorage.getItem('hmi-variables-config');
      if (savedVariables) {
        const variables = JSON.parse(savedVariables);
        const found = variables.find((v: any) => v.id === variable.id);
        return found?.unidad !== undefined ? found.unidad : variable.unidad;
      }
    } catch (error) {
      console.error('Error loading variable unit:', error);
    }
    return variable.unidad;
  }

  saveHistoricalConfig(): void {
    try {
      const selectedIds = this.selectedVariables.map(v => v.id);
      console.log('[VariablesDatabase] Guardando configuración. IDs seleccionados:', selectedIds);

      // Actualizar el campo 'selected' en el servicio para cada variable
      this.allVariables.forEach(variable => {
        const isSelected = selectedIds.includes(variable.id);
        this.mockDataService.updateVariableSelected(variable.id, isSelected);
      });

      // Actualizar el estado en la lista local
      this.allVariables = this.allVariables.map(variable => ({
        ...variable,
        selected: selectedIds.includes(variable.id),
        historicalEnabled: selectedIds.includes(variable.id)
      }));

      console.log('[VariablesDatabase] Configuración guardada. Variables con selected=true:',
        this.allVariables.filter(v => v.selected).map(v => v.id));

      // Mostrar mensaje de éxito
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Configuración guardada correctamente. ${selectedIds.length} variables habilitadas para historizar.`,
        life: 3000
      });
    } catch (error) {
      console.error('Error saving historical config:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al guardar la configuración',
        life: 3000
      });
    }
  }

  private loadHistoricalConfig(): number[] {
    try {
      const saved = localStorage.getItem('hmi-historical-config');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading historical config:', error);
      return [];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
