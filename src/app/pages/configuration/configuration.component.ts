import { Component, OnInit } from '@angular/core';
import { MockDataService, EntityData } from '../../services/mock-data.service';

export interface EntityTableData {
  id: number;
  description: string;
  connectionString: string;
  image: string;
  color: string;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  entities: EntityData[] = [];
  showModal: boolean = false;
  selectedEntity: EntityData | null = null;

  // Tabla de entidades
  entitiesTableData: EntityTableData[] = [
    {
      id: 1,
      description: 'Oficina',
      connectionString: 'opc.tcp://localhost:49320',
      image: '',
      color: '#2196F3'
    },
    {
      id: 2,
      description: 'General Taller',
      connectionString: 'opc.tcp://localhost:49320',
      image: '',
      color: '#4CAF50'
    },
    {
      id: 3,
      description: 'Vestuarios Despachos',
      connectionString: 'opc.tcp://localhost:49320',
      image: '',
      color: '#FF9800'
    }
  ];

  showUpdateModal: boolean = false;
  selectedEntityForUpdate: EntityTableData | null = null;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadEntitiesFromLocalStorage();
    this.loadEntities();
  }

  private loadEntitiesFromLocalStorage(): void {
    try {
      const savedEntities = localStorage.getItem('hmi-entities-config');
      if (savedEntities) {
        this.entitiesTableData = JSON.parse(savedEntities);
      }
    } catch (error) {
      console.error('Error loading entities from localStorage:', error);
    }
  }

  private saveEntitiesToLocalStorage(): void {
    try {
      localStorage.setItem('hmi-entities-config', JSON.stringify(this.entitiesTableData));
    } catch (error) {
      console.error('Error saving entities to localStorage:', error);
    }
  }

  loadEntities(): void {
    this.mockDataService.getEntityData().subscribe(entities => {
      this.entities = entities;
    });
  }

  openMonitoringModal(entity: EntityData): void {
    this.selectedEntity = entity;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedEntity = null;
    this.loadEntities(); // Reload to get updated counts
  }

  openUpdateModal(entity: EntityTableData): void {
    this.selectedEntityForUpdate = { ...entity };
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedEntityForUpdate = null;
  }

  updateEntity(entity: EntityTableData): void {
    const index = this.entitiesTableData.findIndex(e => e.id === entity.id);
    if (index !== -1) {
      this.entitiesTableData[index] = { ...entity };
      this.saveEntitiesToLocalStorage();

      // Recargar las entidades para actualizar las tarjetas
      this.loadEntities();
    }
    this.closeUpdateModal();
  }

  getEntityConfig(entityId: number): EntityTableData | undefined {
    return this.entitiesTableData.find(e => e.id === entityId);
  }
}
