import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { BidService } from '../../services/bid.service';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent {
  item: any | null = null;
  bids: any[] = [];
  itemId: number = 0;
  newBidAmount: number = 0;
  winner: any = null;
  currentImageIndex: number = 0;
  currentImage: string = '';
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  seller: any;
  isWinner: boolean = false;
  hasRated: boolean = false;
  ratingForm: FormGroup;

  constructor(
    private itemService: ItemService,
    private bidService: BidService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.ratingForm = this.fb.group({
      ratingScore: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comments: ['']
    });
  }

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));

    // Call both APIs (item details and bid history)
    forkJoin([
      this.itemService.getItemById(this.itemId), // API to get item details
      this.bidService.getBidHistory(this.itemId), // API to get bid history
    ]).subscribe({
      next: ([item, bids]) => {
        this.item = item;
        this.bids = bids;
        this.loadSellerInfo(item.sellerUsername);
        if (this.item && this.item.images.length > 0) {
          this.currentImage = this.item.images[this.currentImageIndex];
        }
        // Process the winner logic only if bidding has ended and there are bids
        if (this.item.bidStatus === 'E' && this.bids.length > 0) {
          this.winner = this.bids.reduce((prev, current) =>
            prev.bidAmount > current.bidAmount ? prev : current
          );
          this.isWinner = this.user.userId === this.winner.bidderId;
        } else if (this.item.bidStatus === 'E' && this.bids.length === 0) {
          this.winner = 'No bidder';
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  submitRating(): void {
    if (this.item && this.winner) {
      const ratedUserId = this.item.sellerId; // Người bán
      const ratedByUserId = this.winner.bidderId; // Người chiến thắng

      const ratingScore = this.ratingForm.get('ratingScore')?.value; // Điểm đánh giá từ form
      const comments = this.ratingForm.get('comments')?.value; // Bình luận từ form

      this.userService
        .createRating(
          ratedUserId,
          ratedByUserId,
          this.item.itemId,
          ratingScore,
          comments
        )
        .subscribe({
          next: () => {
            console.log('Rating submitted successfully.');
            this.hasRated = true; // Đánh dấu người dùng đã đánh giá
          },
          error: (err) => {
            console.error('Error submitting rating:', err);
          },
        });
    } else {
      console.error('Item or winner information is missing.');
    }
  }

  prevImage() {
    if (this.item && this.item.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.item.images.length) %
        this.item.images.length;
      this.currentImage = this.item.images[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.item && this.item.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.item.images.length;
      this.currentImage = this.item.images[this.currentImageIndex];
    }
  }

  submitBid(): void {
    if (this.newBidAmount > 0 && this.item) {
      this.bidService.submitBid(this.item.itemId, this.newBidAmount).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (err) => {
          console.error('Error submitting bid:', err);
        },
      });
    } else {
      console.error('Invalid bid amount or item not available');
    }
  }

  loadBidHistory(): void {
    this.bidService.getBidHistory(this.itemId).subscribe({
      next: (response) => {
        this.bids = response;

        // Update the winner after reloading bids if bidding has ended
        if (this.item.bidStatus === 'E' && this.bids.length > 0) {
          this.winner = this.bids.reduce((prev, current) =>
            prev.bidAmount > current.bidAmount ? prev : current
          );
        }
      },
      error: (err) => {
        console.error('Error loading bid history:', err);
      },
    });
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

  formatCountdown(targetDate: string): string {
    const timeLeft = this.getTimeLeft(targetDate);
    if (timeLeft <= 0) {
      return 'Please reload for update Bid Status!';
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

  getTimeLeft(targetDate: string): number {
    return new Date(targetDate).getTime() - new Date().getTime();
  }

  goToSellerDetail(sellerUsername: string) {
    this.router.navigate(['/user/seller-detail', sellerUsername]);
  }
}
