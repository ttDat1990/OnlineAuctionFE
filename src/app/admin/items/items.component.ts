import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './items.component.html',
})
export class AdminItemsComponent {
  constructor(private router: Router) {}
}
