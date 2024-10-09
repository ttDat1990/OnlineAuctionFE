import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class AdminUserComponent {
  constructor(private router: Router) {}
}
