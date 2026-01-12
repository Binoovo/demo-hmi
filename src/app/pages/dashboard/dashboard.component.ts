import { Component, OnInit, OnDestroy } from '@angular/core';
import { MockDataService, Variable, PlcData, AlarmData } from '../../services/mock-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  variables: Variable[] = [];
  plcData: PlcData[] = [];
  alarms: AlarmData[] = [];
  private destroy$ = new Subject<void>();

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    // Suscribirse a las variables en tiempo real
    this.mockDataService.getVariables()
      .pipe(takeUntil(this.destroy$))
      .subscribe(variables => {
        this.variables = variables;
      });

    // Obtener datos de PLCs
    this.mockDataService.getPlcData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(plcData => {
        this.plcData = plcData;
      });

    // Obtener alarmas activas
    this.mockDataService.getActiveAlarms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(alarms => {
        this.alarms = alarms;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  acknowledgeAlarm(alarmId: number): void {
    this.mockDataService.acknowledgeAlarm(alarmId);
  }

  getSeverityClass(severity: string): string {
    const severityMap: { [key: string]: string } = {
      'low': 'p-tag-info',
      'medium': 'p-tag-warning',
      'high': 'p-tag-danger',
      'critical': 'p-tag-danger'
    };
    return severityMap[severity] || 'p-tag-info';
  }
}
