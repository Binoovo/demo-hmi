import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { EntityData, Variable, MockDataService } from '../../../../services/mock-data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-variable-monitor-modal',
  templateUrl: './variable-monitor-modal.component.html',
  styleUrls: ['./variable-monitor-modal.component.scss']
})
export class VariableMonitorModalComponent implements OnInit, OnChanges {
  @Input() entity!: EntityData;
  @Input() visible: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  allVariables: Variable[] = [];
  selectedVariables: Variable[] = [];

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadVariables();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo recargar cuando el modal se abre (visible cambia a true)
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.loadVariables();
    }
  }

  loadVariables(): void {
    // Usar take(1) para obtener solo el primer valor y desuscribirse automáticamente
    this.mockDataService.getVariablesByEntity(this.entity.entityId)
      .pipe(take(1))
      .subscribe(variables => {
        // Hacer una copia profunda para evitar referencias reactivas
        this.allVariables = JSON.parse(JSON.stringify(variables));
        this.selectedVariables = this.allVariables.filter(v => v.monitoring);
      });
  }

  isSelected(variable: Variable): boolean {
    return this.selectedVariables.some(v => v.id === variable.id);
  }

  toggleVariable(variable: Variable): void {
    const index = this.selectedVariables.findIndex(v => v.id === variable.id);
    if (index >= 0) {
      this.selectedVariables.splice(index, 1);
    } else {
      this.selectedVariables.push(variable);
    }
  }

  accept(): void {
    const selectedIds = this.selectedVariables.map(v => v.id);
    const allIds = this.allVariables.map(v => v.id);

    // Mark selected as monitoring true
    this.mockDataService.updateVariableMonitoring(selectedIds, true);
    // Mark non-selected as monitoring false
    const unselectedIds = allIds.filter(id => !selectedIds.includes(id));
    this.mockDataService.updateVariableMonitoring(unselectedIds, false);

    this.onClose.emit();
  }

  cancel(): void {
    this.onClose.emit();
  }
}
