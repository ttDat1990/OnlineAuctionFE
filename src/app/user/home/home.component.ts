import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router) {}
}
