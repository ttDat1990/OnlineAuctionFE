import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class AdminLayoutComponent {
  user: any = JSON.parse(localStorage.getItem('user') || 'null');
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
