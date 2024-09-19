import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './seller-detail.component.html',
  styleUrls: ['./seller-detail.component.css'],
})
export class SellerDetailComponent {
  seller: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    var sellerUsername = this.route.snapshot.paramMap.get('sellerUsername');
    this.loadSellerInfo(sellerUsername);
  }

  loadSellerInfo(username: string) {
    this.userService.getAccountByUsername(username).subscribe({
      next: (response) => {
        this.seller = response;
      },
      error: (err) => {
        console.error('Error loading seller info:', err);
      },
    });
  }

  goToItemDetail(itemId: number) {
    this.router.navigate(['/user/item-detail', itemId]);
  }
}
