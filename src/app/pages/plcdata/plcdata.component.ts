import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockDataService, EntityData } from '../../services/mock-data.service';
import { Subject, takeUntil } from 'rxjs';

interface EntityWithColor extends EntityData {
  color?: string;
}

@Component({
  selector: 'app-plcdata',
  templateUrl: './plcdata.component.html',
  styleUrls: ['./plcdata.component.scss']
})
export class PlcdataComponent implements OnInit, OnDestroy {
  entities: EntityWithColor[] = [];
  private destroy$ = new Subject<void>();
  private entityColors: Map<number, string> = new Map();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadEntityColors();

    // Suscribirse a las entidades en tiempo real
    this.mockDataService.getEntityData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(entities => {
        this.entities = entities.map(entity => ({
          ...entity,
          color: this.entityColors.get(entity.entityId) || '#2196F3'
        }));
      });
  }

  private loadEntityColors(): void {
    try {
      const savedEntities = localStorage.getItem('hmi-entities-config');
      if (savedEntities) {
        const configs = JSON.parse(savedEntities);
        configs.forEach((config: any) => {
          this.entityColors.set(config.id, config.color);
        });
      } else {
        // Colores por defecto
        this.entityColors.set(1, '#2196F3');
        this.entityColors.set(2, '#4CAF50');
        this.entityColors.set(3, '#FF9800');
      }
    } catch (error) {
      console.error('Error loading entity colors:', error);
      // Colores por defecto en caso de error
      this.entityColors.set(1, '#2196F3');
      this.entityColors.set(2, '#4CAF50');
      this.entityColors.set(3, '#FF9800');
    }
  }

  getVariableIcon(variable: any): string | null {
    try {
      const savedVariables = localStorage.getItem('hmi-variables-config');
      if (savedVariables) {
        const variables = JSON.parse(savedVariables);
        const found = variables.find((v: any) => v.id === variable.id);
        return found?.icon || null;
      }
    } catch (error) {
      console.error('Error loading variable icon:', error);
    }
    return null;
  }

  getVariableUnit(variable: any): string {
    try {
      const savedVariables = localStorage.getItem('hmi-variables-config');
      if (savedVariables) {
        const variables = JSON.parse(savedVariables);
        const found = variables.find((v: any) => v.id === variable.id);
        return found?.unidad || variable.unidad;
      }
    } catch (error) {
      console.error('Error loading variable unit:', error);
    }
    return variable.unidad;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
