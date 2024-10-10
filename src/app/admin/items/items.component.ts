import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { CategoryService } from '../../services/category.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class AdminItemsComponent {
  items: any[] = [];
  categories: any[] = [];
  selectedBidStatus: string = ''; // All statuses by default
  selectedCategory: string = ''; // All categories by default
  paginatedItems: any[] = [];
  currentPage: number = 1;
  pageSize: number = 7; // Số mục mỗi trang
  totalItems: number = 0;
  totalPages: number = 0; // Tổng số trang

  selectedItemId: number | null = null;
  deleteReason: string = ''; // Lưu lý do xóa
  showModal: boolean = false; // Điều khiển hiện/ẩn modal

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchItems();
  }
  fetchCategories() {
    // Fetch the categories from the backend
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }
  fetchItems() {
    this.itemService.getAllItems().subscribe((data: any) => {
      this.items = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Tính tổng số trang
      this.paginateItems();
    });
  }

  openDeleteModal(itemId: number) {
    this.selectedItemId = itemId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.deleteReason = '';
    this.selectedItemId = null;
  }

  // Phân trang
  paginateItems() {
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

    this.totalPages = Math.ceil(tempItems.length / this.pageSize);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = tempItems.slice(startIndex, endIndex);
  }

  // Thay đổi trang
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateItems();
    }
  }

  // Update filters
  onBidStatusChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedBidStatus = selectElement.value;
    this.paginateItems();
  }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    this.selectedCategory = categoryId;
    console.log(this.selectedCategory);
    this.paginateItems();
  }

  confirmDelete() {
    if (this.selectedItemId && this.deleteReason.trim()) {
      this.itemService
        .deleteItem(this.selectedItemId, this.deleteReason)
        .subscribe(() => {
          this.fetchItems(); // Cập nhật lại danh sách items sau khi xóa
          this.closeModal(); // Đóng modal
        });
    } else {
      alert('Please provide a reason for deletion.');
    }
  }
}
