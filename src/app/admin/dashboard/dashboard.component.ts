import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ItemService } from '../../services/item.service';
import { BidService } from '../../services/bid.service';
import { CategoryService } from '../../services/category.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  totalUsers: number = 0;
  totalItems: number = 0;
  totalCategories: number = 0;
  newUsersThisWeek: number = 0;
  mostFavoritedItem: string = '';
  usersWithLowRatings: number = 0;
  ongoingAuctions: number = 0;
  endedAuctions: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getTotalUsers();
    this.getNewUsersThisWeek();
    this.getTotalItems();
    this.getTotalCategories();
    this.getMostFavoritedItem();
    this.getUsersWithLowRatings();
    this.getOngoingAuctions();
    this.getEndedAuctions();
  }

  getTotalUsers(): void {
    this.userService.showAllUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  getNewUsersThisWeek(): void {
    this.userService.showAllUsers().subscribe({
      next: (users) => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        this.newUsersThisWeek = users.filter(
          (user: any) => new Date(user.createdDate) > lastWeek
        ).length;
      },
      error: (err) => console.error('Error fetching users', err),
    });
  }

  getTotalItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.totalItems = items.length;
      },
      error: (err) => console.error('Error fetching items', err),
    });
  }

  getTotalCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
      },
      error: (err) => console.error('Error fetching categories', err),
    });
  }

  getMostFavoritedItem(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        const mostFavorited = items.reduce((prev: any, current: any) => 
          current.favoritesCount > prev.favoritesCount ? current : prev
        );
        this.mostFavoritedItem = mostFavorited ? mostFavorited.itemTitle : 'No data';
      },
      error: (err) => console.error('Error fetching items', err),
    });
  }

  getUsersWithLowRatings(): void {
    this.userService.showAllUsers().subscribe({
      next: (users) => {
        this.usersWithLowRatings = users.filter(
          (user: any) => user.ratingScore < 0
        ).length;
      },
      error: (err) => console.error('Error fetching users with low ratings', err),
    });
  }

  getOngoingAuctions(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.ongoingAuctions = items.filter(
          (item) => item.bidStatus === 'A'
        ).length;
      },
      error: (err) => console.error('Error fetching ongoing auctions', err),
    });
  }

  getEndedAuctions(): void {
    this.itemService.getAllItems().subscribe({
      next: (items) => {
        this.endedAuctions = items.filter(
          (item) => item.bidStatus === 'E'
        ).length;
      },
      error: (err) => console.error('Error fetching ended auctions', err),
    });
  }
}
