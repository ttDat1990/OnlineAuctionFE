import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AllItemsComponent } from '../items/all-items.component';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AllItemsComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private router: Router) {}
}
