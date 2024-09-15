import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: any = JSON.parse(localStorage.getItem('user'));
  searchQuery: string = '';
  constructor(private router: Router) {}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  onSearch() {
    if (this.searchQuery) {
      this.router.navigate(['/user/search'], {
        queryParams: { query: this.searchQuery },
      });
    }
  }
  profile() {}
}
