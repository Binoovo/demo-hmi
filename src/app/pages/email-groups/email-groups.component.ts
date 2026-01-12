import { Component, OnInit } from '@angular/core';

interface EmailGroup {
  id: number;
  name: string;
  emailCount: number;
}

interface Email {
  id: number;
  email: string;
  groupName: string;
}

@Component({
  selector: 'app-email-groups',
  templateUrl: './email-groups.component.html',
  styleUrls: ['./email-groups.component.scss']
})
export class EmailGroupsComponent implements OnInit {
  emailGroups: EmailGroup[] = [];
  emails: Email[] = [];

  ngOnInit(): void {
    this.loadEmailGroups();
    this.loadEmails();
  }

  loadEmailGroups(): void {
    this.emailGroups = [
      {
        id: 1,
        name: 'grupodeCorreos1',
        emailCount: 2
      },
      {
        id: 2,
        name: 'grupodeCorreos2',
        emailCount: 1
      }
    ];
  }

  loadEmails(): void {
    this.emails = [
      {
        id: 1,
        email: 'admin@empresa.com',
        groupName: 'grupodeCorreos1'
      },
      {
        id: 2,
        email: 'operador@empresa.com',
        groupName: 'grupodeCorreos1'
      },
      {
        id: 3,
        email: 'tecnico@empresa.com',
        groupName: 'grupodeCorreos2'
      }
    ];
  }
}
