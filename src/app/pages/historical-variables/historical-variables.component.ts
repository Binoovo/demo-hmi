import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockDataService, HistoricalData } from '../../services/mock-data.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-historical-variables',
  templateUrl: './historical-variables.component.html',
  styleUrls: ['./historical-variables.component.scss']
})
export class HistoricalVariablesComponent implements OnInit, OnDestroy {
  historicalData: HistoricalData[] = [];
  private destroy$ = new Subject<void>();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.loadHistoricalData();
  }

  loadHistoricalData(): void {
    this.mockDataService.getHistoricalVariables()
      .pipe(take(1)) // Solo cargar una vez, no regenerar continuamente
      .subscribe(data => {
        this.historicalData = data;
      });
  }

  exportCSV(): void {
    if (this.historicalData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear el contenido CSV
    const headers = ['Date', 'Desc_Variable', 'PlcValue', 'Unidad', 'Desc_Entity'];
    const csvContent = [
      headers.join(','),
      ...this.historicalData.map(record => [
        this.formatDate(record.date),
        `"${record.desc_variable}"`,
        record.plcValue,
        record.unidad,
        `"${record.desc_entity}"`
      ].join(','))
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `historico_variables_${this.getTimestamp()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
