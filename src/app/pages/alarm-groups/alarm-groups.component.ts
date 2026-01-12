import { Component, OnInit } from '@angular/core';

interface AlarmGroup {
  id: number;
  groupName: string;
  emailGroup: string;
  alarmCount: number;
}

@Component({
  selector: 'app-alarm-groups',
  templateUrl: './alarm-groups.component.html',
  styleUrls: ['./alarm-groups.component.scss']
})
export class AlarmGroupsComponent implements OnInit {
  alarmGroups: AlarmGroup[] = [];

  ngOnInit(): void {
    this.loadAlarmGroups();
  }

  loadAlarmGroups(): void {
    this.alarmGroups = [
      {
        id: 1,
        groupName: 'Alarmas Críticas',
        emailGroup: 'grupodeCorreos1',
        alarmCount: 5
      },
      {
        id: 2,
        groupName: 'Alarmas de Temperatura',
        emailGroup: 'grupodeCorreos2',
        alarmCount: 3
      },
      {
        id: 3,
        groupName: 'Alarmas de Voltaje',
        emailGroup: 'grupodeCorreos1',
        alarmCount: 2
      }
    ];
  }
}
