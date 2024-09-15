import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';

@Component({
  selector: 'search-items-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './search-items.component.html',
  styleUrls: ['./search-items.component.css'],
})
export class SearchItemsComponent {
  query: string = '';
  items: any[] = [];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['query'];
      this.fetchItems();
    });

    interval(1000).subscribe(() => {
      this.items.forEach((item) => {
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
    this.itemService.searchItems(this.query).subscribe({
      next: (data) => {
        this.items = data;
        console.log(this.items);
      },
      error: (error) => {
        console.error('Error fetching items', error);
        this.items = [];
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

  formatCountdown(targetDate: string): string {
    const timeLeft = this.getTimeLeft(targetDate);

    if (timeLeft <= 0) {
      return 'Expired';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Tạo mảng chứa các giá trị cần hiển thị
    const parts: string[] = [];

    if (days > 0) {
      parts.push(`${days}d`);
    }
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}s`);
    }

    // Ghép các phần tử của mảng thành một chuỗi kết quả
    return parts.join(' ');
  }

  goToDetail(itemId: number) {
    this.router.navigate(['/user/item-detail', itemId]);
  }
}
