import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  user: any = JSON.parse(localStorage.getItem('user') || 'null');
  categories: any[] = [];
  searchQuery: string = '';
  selectedCategoryId: string = '';
  showProfile: boolean = false;
  notifications: any[] = [];
  unreadNotifications: number = 0;
  userId: number = this.user ? this.user.userId : null;
  showNotifications: boolean = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    this.loadNotifications();
  }
  loadNotifications() {
    if (this.user == null) return;
    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (data: any[]) => {
        this.notifications = data;
        this.unreadNotifications = data.filter((n) => !n.isRead).length;
      },
      error: (error) => {
        console.error('Error loading notifications', error);
      },
    });
  }

  markNotificationsAsRead(notificationId: number) {
    this.notificationService.markNotificationAsRead(notificationId).subscribe({
      next: (data) => {
        console.log('Notification marked as read');
      },
      error: (error) => {
        console.error('Error marking notification as read', error);
      },
    });
  }
  // Lắng nghe sự kiện click trên document để phát hiện click ra ngoài dropdown
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.notification-dropdown') &&
      !target.closest('.profile-dropdown')
    ) {
      this.showNotifications = false;
      this.showProfile = false;
    }
  }

  toggleNotificationDropdown(event: MouseEvent) {
    event.stopPropagation(); // Ngăn việc sự kiện click trên document được kích hoạt
    if (this.showProfile) {
      this.showProfile = false; // Tắt profile dropdown nếu nó đang mở
    }
    this.showNotifications = !this.showNotifications;
  }

  toggleProfileDropdown(event: MouseEvent) {
    event.stopPropagation(); // Ngăn việc sự kiện click trên document được kích hoạt
    if (this.showNotifications) {
      this.showNotifications = false; // Tắt notification dropdown nếu nó đang mở
    }
    this.showProfile = !this.showProfile;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  onSearch() {
    if (this.searchQuery) {
      this.router.navigate(['/user/search'], {
        queryParams: { query: this.searchQuery },
      });
      this.selectedCategoryId = '';
    }
  }

  profile(sellerUsername: string) {
    this.router.navigate(['/user/seller-detail', sellerUsername]);
  }

  fetchCategories() {
    // Fetch the categories from the backend
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  // Điều hướng đến trang danh sách item của category
  onCategoryChange(event: any) {
    const categoryId = event.target.value;

    // Tìm category tương ứng trong danh sách dựa trên categoryId
    const selectedCategory = this.categories.find(
      (category) => category.categoryId == categoryId
    );

    if (selectedCategory) {
      const categoryName = selectedCategory.categoryName;

      this.router.navigate(['/user/search'], {
        queryParams: { categoryId: categoryId, categoryName: categoryName },
      });
    }
  }

  findIdFromString(text: string): number | null {
    const regex = /\(id:(\d+)\)/;
    const match = text.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return null;
  }

  navigateToDetail(notification: any) {
    const notificationId = notification.notificationId;
    const itemId = this.findIdFromString(notification.message);

    if (notificationId !== null && itemId !== null) {
      this.markNotificationsAsRead(notificationId); // Mark notification as read
      setTimeout(() => {
        this.router.navigate(['/user/item-detail', itemId]);
        this.ngOnInit();
      }, 100); // 100ms delay to ensure async operation completes
    }
  }

  openLoginPage() {
    this.router.navigate(['/login']);
  }

  goToFavItems(): void {
    if (this.userId) {
      // Nếu có userId, điều hướng đến trang yêu thích
      this.router.navigate(['/user/fav-items']);
    } else {
      // Nếu không có userId, điều hướng đến trang đăng nhập
      this.openLoginPage();
    }
  }
}
