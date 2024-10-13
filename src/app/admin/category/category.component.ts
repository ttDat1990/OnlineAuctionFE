import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class AdminCategoryComponent {
  categories: any[] = [];
  categoryId: any;
  categoryForm: any = { categoryName: '' }; // Đối tượng lưu thông tin danh mục
  isEditMode: boolean = false; // Biến để kiểm tra chế độ cập nhật hay tạo mới
  showModal: boolean = false; // Biến để hiển thị modal
  showMergeModal: boolean = false; // Modal gộp danh mục

  paginatedCategories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 8; // Số mục mỗi trang
  totalItems: number = 0;
  totalPages: number = 0; // Tổng số trang

  // Biến cho tính năng gộp danh mục
  selectedCategoryIds: number[] = []; // Danh mục đã chọn
  targetCategoryId: number | null = null; // Danh mục đích
  targetCategoryName: string = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories() {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.totalItems = data.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize); // Tính tổng số trang
      this.paginateCategories();
    });
  }

  // Phân trang
  paginateCategories() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.categories.slice(startIndex, endIndex);
  }

  // Thay đổi trang
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateCategories();
    }
  }

  openCreateCategoryModal() {
    this.isEditMode = false;
    this.categoryForm = { categoryName: '' }; // Reset form
    this.showModal = true; // Hiển thị modal
  }

  openUpdateCategoryModal(category: any) {
    this.isEditMode = true;
    this.categoryForm = { categoryName: category.categoryName }; // Thiết lập dữ liệu cho modal
    this.showModal = true; // Hiển thị modal
    this.categoryId = this.categories.find(
      (category) => category.categoryName === this.categoryForm.categoryName
    )?.categoryId;
  }

  closeModal() {
    this.showModal = false; // Ẩn modal
    this.showMergeModal = false;
  }

  createCategory() {
    this.categoryService.createCategory(this.categoryForm).subscribe(() => {
      this.fetchCategories(); // Cập nhật danh sách danh mục
      this.closeModal(); // Đóng modal
    });
  }

  updateCategory() {
    if (this.categoryId) {
      this.categoryService
        .updateCategory(this.categoryId, this.categoryForm)
        .subscribe(() => {
          this.fetchCategories(); // Cập nhật danh sách danh mục
          this.closeModal(); // Đóng modal
        });
    }
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        this.fetchCategories(); // Cập nhật danh sách danh mục
      });
    }
  }

  // Mở modal gộp danh mục
  openMergeModal(categoryId: number, categoryName: string) {
    this.targetCategoryId = categoryId; // Thiết lập danh mục đích
    this.targetCategoryName = categoryName;
    this.selectedCategoryIds = []; // Reset các danh mục đã chọn
    this.showMergeModal = true; // Hiển thị modal gộp
  }

  // Chọn/Deselect danh mục để gộp
  toggleCategorySelection(categoryId: number) {
    const index = this.selectedCategoryIds.indexOf(categoryId);
    if (index > -1) {
      this.selectedCategoryIds.splice(index, 1); // Nếu đã chọn, bỏ chọn
    } else {
      this.selectedCategoryIds.push(categoryId); // Nếu chưa chọn, thêm vào danh sách
    }
  }

  // Gộp các danh mục
  mergeCategories() {
    if (!this.targetCategoryId || this.selectedCategoryIds.length === 0) {
      alert('Please select categories to merge.');
      return;
    }

    this.categoryService
      .mergeCategories(this.targetCategoryId, this.selectedCategoryIds)
      .subscribe(() => {
        this.fetchCategories(); // Cập nhật danh sách danh mục sau khi gộp
        alert('Categories merged successfully');
        this.closeModal(); // Đóng modal
      });
  }
}
