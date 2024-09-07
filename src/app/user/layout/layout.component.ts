import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, RouterOutlet],
  templateUrl: './layout.component.html',
})
export class UserLayoutComponent {
  constructor(private router: Router) {}
}
