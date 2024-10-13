import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class AdminUserComponent {
  users: any[] = [];
  paginatedItems: any[] = [];
  currentPage: number = 1;
  pageSize: number = 7; // Số mục mỗi trang
  totalItems: number = 0;
  totalPages: number = 0; // Tổng số trang
  selectedUser: any = null;
  showModal: boolean = false; // Điều khiển hiện/ẩn modal
  searchQuery: string = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }
  fetchUsers() {
    // Fetch the categories from the backend
    this.userService.showAllUsers().subscribe((data: any) => {
      this.users = data;
      this.paginateItems();
    });
  }

  // Phân trang
  paginateItems() {
    let tempItems = this.users;

    this.totalPages = Math.ceil(tempItems.length / this.pageSize);

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = tempItems.slice(startIndex, endIndex);
    console.log(this.paginatedItems);
  }

  // Thay đổi trang
  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateItems();
    }
  }

  openBlockModal(user: any) {
    this.selectedUser = user;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser.username = null;
  }

  confirmBlock() {
    if (this.selectedUser.username) {
      this.userService.statusUser(this.selectedUser.username).subscribe(() => {
        this.fetchUsers(); // Cập nhật lại danh sách items sau khi xóa
        this.closeModal(); // Đóng modal
      });
    } else {
      alert('Can not block.');
    }
  }

  onSearch() {
    if (this.searchQuery) {
      this.userService.findUser(this.searchQuery).subscribe((data: any) => {
        console.log(data);
        this.users = data;
        this.paginateItems();
      });
    } else {
      this.fetchUsers();
    }
  }
}
