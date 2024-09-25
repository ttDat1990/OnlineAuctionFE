import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ItemService } from '../../services/item.service';
import { interval } from 'rxjs';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './seller-detail.component.html',
  styleUrls: ['./seller-detail.component.css'],
})
export class SellerDetailComponent {
  seller: any;
  items: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    var sellerUsername = this.route.snapshot.paramMap.get('sellerUsername');
    this.loadSellerInfo(sellerUsername);
    this.fetchItems();
  }

  loadSellerInfo(username: string) {
    this.userService.getAccountByUsername(username).subscribe({
      next: (response) => {
        this.seller = response;
        console.log(this.seller);
      },
      error: (err) => {
        console.error('Error loading seller info:', err);
      },
    });
  }

  fetchItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        // Filter items with bidStatus 'A'
        this.items = data.filter(
          (item) => item.sellerId === this.seller.userId
        );
      },
      error: (error) => {
        console.error('Error fetching items', error);
      },
      complete: () => {
        console.log('Item fetching completed');
      },
    });
  }

  goToItemDetail(itemId: number) {
    this.router.navigate(['/user/item-detail', itemId]);
  }
}
