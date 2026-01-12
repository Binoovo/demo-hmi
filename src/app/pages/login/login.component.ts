import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  login(): void {
    // Guardar usuario en localStorage para simular sesión
    localStorage.setItem('currentUser', JSON.stringify({ username: this.username }));
    // Redirigir a plcdata sin validar credenciales
    this.router.navigate(['/plcdata']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
