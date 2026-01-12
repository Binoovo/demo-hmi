import { Component, OnInit } from '@angular/core';

interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  searchValue: string = '';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = [
      {
        id: 1,
        name: 'admin',
        email: 'admin@gmail.com',
        image: '',
        password: '**********',
        role: 'ADMIN'
      }
    ];
  }

  onSearch(event: any): void {
    // Búsqueda deshabilitada por ahora
  }
}
