import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../header/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
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
