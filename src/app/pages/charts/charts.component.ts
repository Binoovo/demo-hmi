import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockDataService } from '../../services/mock-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnDestroy {

  entities: any[] = [];
  selectedVariable: any = null;
  chartData: any;
  chartOptions: any;
  private destroy$ = new Subject<void>();

  constructor(private mockDataService: MockDataService) {
    this.initChartOptions();
  }

  ngOnInit(): void {
    console.log('[ChartsComponent] ngOnInit - cargando entidades y variables');
    this.loadEntitiesAndVariables();

    // Suscribirse a cambios en las variables para actualizar la lista reactivamente
    this.mockDataService.getVariables()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('[ChartsComponent] Variables actualizadas - recargando entidades');
        this.loadEntitiesAndVariables();
      });
  }

  loadEntitiesAndVariables(): void {
    console.log('[ChartsComponent] loadEntitiesAndVariables llamado');
    this.mockDataService.getEntitiesWithVariablesForChart()
      .pipe(takeUntil(this.destroy$))
      .subscribe(entities => {
        console.log('[ChartsComponent] Entidades recibidas:', entities);
        this.entities = entities;
      });
  }

  onVariableSelectionChange(event: any): void {
    if (event && event.id) {
      this.loadChartData(event.id);
      // Limpiar la selección para que el cascadeSelect siempre abra desde el nivel raíz
      setTimeout(() => {
        this.selectedVariable = null;
      }, 100);
    } else if (event) {
      this.loadChartData(event);
      setTimeout(() => {
        this.selectedVariable = null;
      }, 100);
    }
  }

  loadChartData(variableId: number): void {
    this.mockDataService.getHistoricalDataForChart(variableId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Formatear las fechas para el eje X
        const labels = data.timestamps.map(timestamp =>
          this.formatDateTime(timestamp)
        );

        const documentStyle = getComputedStyle(document.documentElement);

        this.chartData = {
          labels: labels,
          datasets: [
            {
              label: `${data.variableName} (${data.unidad})`,
              data: data.values,
              borderColor: documentStyle.getPropertyValue('--pink-500') || '#EC4899',
              tension: 0.4,
              fill: false
            }
          ]
        };
      });
  }

  formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  initChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#ebedef';

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
