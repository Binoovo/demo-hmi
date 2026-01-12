import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headerbar',
  templateUrl: './headerbar.component.html',
  styleUrls: ['./headerbar.component.scss']
})
export class HeaderbarComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  constructor(private router: Router) {}

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  logOut() {
    // Clear any stored user data
    localStorage.removeItem('currentUser');
    // Navigate to login
    this.router.navigate(['/login']);
  }
}
