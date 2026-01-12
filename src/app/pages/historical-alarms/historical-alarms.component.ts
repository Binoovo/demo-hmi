import { Component, OnInit } from '@angular/core';
import { MockDataService, HistoricalAlarm } from '../../services/mock-data.service';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-historical-alarms',
  templateUrl: './historical-alarms.component.html',
  styleUrls: ['./historical-alarms.component.scss'],
  providers: [MessageService]
})
export class HistoricalAlarmsComponent implements OnInit {
  historicalAlarms: HistoricalAlarm[] = [];
  activeAlarms: HistoricalAlarm[] = [];

  constructor(
    private mockDataService: MockDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadHistoricalAlarms();
  }

  loadHistoricalAlarms(): void {
    this.mockDataService.getHistoricalAlarms()
      .pipe(take(1))
      .subscribe(alarms => {
        this.historicalAlarms = alarms;
        this.activeAlarms = alarms.filter(alarm => alarm.isActive);
      });
  }

  acknowledgeAlarm(alarm: HistoricalAlarm): void {
    // Toggle del estado de reconocimiento
    alarm.acknowledged = !alarm.acknowledged;

    // Mostrar notificación toast
    if (alarm.acknowledged) {
      this.messageService.add({
        severity: 'success',
        summary: 'Alarma Reconocida',
        detail: `La alarma "${alarm.alarma}" ha sido reconocida correctamente.`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Reconocimiento Revertido',
        detail: `El reconocimiento de la alarma "${alarm.alarma}" ha sido revertido.`,
        life: 3000
      });
    }
  }

  exportCSV(): void {
    if (this.historicalAlarms.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin Datos',
        detail: 'No hay datos para exportar',
        life: 3000
      });
      return;
    }

    // Crear el contenido CSV
    const headers = ['Date', 'Alarma', 'Desc_Variable', 'PlcValue', 'Unidad', 'Desc_Entity', 'IsActive', 'Acknowledged'];
    const csvContent = [
      headers.join(','),
      ...this.historicalAlarms.map(alarm => [
        this.formatDate(alarm.date),
        `"${alarm.alarma}"`,
        `"${alarm.desc_variable}"`,
        alarm.plcValue,
        alarm.unidad,
        `"${alarm.desc_entity}"`,
        alarm.isActive ? 'Si' : 'No',
        alarm.acknowledged ? 'Si' : 'No'
      ].join(','))
    ].join('\n');

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `historico_alarmas_${this.getTimestamp()}.csv`);
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
}
