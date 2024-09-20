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
  categoryName: string = '';
  categoryId: number = null;
  items: any[] = [];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Lắng nghe cả queryParams và routeParams
    this.route.queryParams.subscribe((params) => {
      this.query = params['query']; // Lấy query từ queryParams nếu có
      this.categoryName = params['categoryName'];
      this.categoryId = params['categoryId'];
      if (this.query) {
        this.fetchItemsByQuery(); // Tìm kiếm theo query nếu có
      }
      if (this.categoryId) {
        this.fetchItemsByCategory(); // Tìm kiếm theo categoryId nếu có
      }
    });

    interval(1000).subscribe(() => {
      this.items.forEach((item) => {
        if (item.BidStatus === 'A') {
          const timeLeft = this.getTimeLeft(item.BidEndDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'E';
          }
        } else if (item.BidStatus === 'I') {
          const timeLeft = this.getTimeLeft(item.BidStartDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'A';
          }
        }
      });
    });
  }

  fetchItemsByQuery(): void {
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

  fetchItemsByCategory(): void {
    this.itemService.searchItemsByCateId(this.categoryId).subscribe({
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
      window.location.reload();
      return 'Reload for updating Status';
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days != 0 ? days + 'd ' : ''}${hours ? hours + 'h ' : ''}${
      minutes ? minutes + 'm ' : ''
    }${seconds ? seconds + 's' : ''}`;
  }

  goToDetail(itemId: number) {
    this.router.navigate(['/user/item-detail', itemId]);
  }
}
