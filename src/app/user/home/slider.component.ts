import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  items = [
    {
      image: 'images/banner1.png',
    },
    {
      image: 'images/banner2.png',
    },
    {
      image: 'images/banner3.png',
    },
    {
      image: 'images/banner4.png',
    },
  ];

  currentIndex = 0;
  interval: any;

  constructor() {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoSlide() {
    this.interval = setInterval(() => {
      this.next();
    }, 3000); // Thay đổi hình ảnh mỗi 3 giây
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  getTranslateValue() {
    return `translateX(-${this.currentIndex * 100}%)`; // Sử dụng translateX để trượt ngang
  }
}
