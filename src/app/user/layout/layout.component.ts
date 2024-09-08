import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../header/navbar.component';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet, NavbarComponent],
  templateUrl: './layout.component.html',
})
export class UserLayoutComponent {
  user: any = JSON.parse(localStorage.getItem('user'));
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
