import { Component } from '@angular/core';
import { SliderComponent } from './slider.component';
import { CurrentBidComponent } from './currentBid.component';

@Component({
  standalone: true,
  imports: [SliderComponent, CurrentBidComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor() {}

  ngOnInit(): void {}
}
