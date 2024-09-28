import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CommonModule } from '@angular/common';
import { interval } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'all-items-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css'],
})
export class AllItemsComponent {
  items: any[] = [];
  filteredItems: any[] = [];
  categories: any[] = [];
  selectedBidStatus: string = ''; // All statuses by default
  selectedCategory: string = ''; // All categories by default
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchItems();
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

  fetchCategories() {
    // Fetch the categories from the backend
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  fetchItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        this.items = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching items', error);
      },
      complete: () => {
        console.log('Item fetching completed');
      },
    });
  }

  applyFilters(): void {
    // Filter by bidStatus
    let tempItems = this.items;
    if (this.selectedBidStatus) {
      tempItems = tempItems.filter(
        (item) => item.bidStatus === this.selectedBidStatus
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      tempItems = tempItems.filter(
        (item) => item.categoryId == this.selectedCategory
      );
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredItems = tempItems.slice(startIndex, endIndex);
  }

  // Update filters
  onBidStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBidStatus = selectElement.value;
    this.applyFilters();
  }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    this.selectedCategory = categoryId;
    console.log(this.selectedCategory);
    this.applyFilters();
  }

  // Pagination controls
  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters();
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
