import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'all-items-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css'],
})
export class AllItemsComponent {
  items: any[] = [];

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.fetchItems();
    interval(1000).subscribe(() => {
      this.items.forEach(item => {
        if (item.BidStatus === 'A') {
          const timeLeft = this.getTimeLeft(item.BidEndDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'E'; // Chuyển trạng thái sang 'Bidding closed' khi hết thời gian
          }
        } else if (item.BidStatus === 'I') {
          const timeLeft = this.getTimeLeft(item.BidStartDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'A'; // Chuyển trạng thái sang 'Active' khi thời gian bắt đầu đến
          }
        }
      });
    });
  }

  fetchItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        console.log(this.items);
      },
      error: (error) => {
        console.error('Error fetching items', error);
      },
      complete: () => {
        console.log('Item fetching completed');
      },
    });
  }

  getTimeLeft(targetDate: string): number {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    return target - now;
  }

  // Hàm định dạng thời gian đếm ngược
  formatCountdown(targetDate: string): string {
    const timeLeft = this.getTimeLeft(targetDate);

    if (timeLeft <= 0) {
      return 'Expired';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
