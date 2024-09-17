import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { BidService } from '../../services/bid.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
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
  user: any = JSON.parse(localStorage.getItem('user'));

  constructor(
    private itemService: ItemService,
    private bidService: BidService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

        if (this.item && this.item.images.length > 0) {
          this.currentImage = this.item.images[this.currentImageIndex];
        }
        // Process the winner logic only if bidding has ended and there are bids
        if (this.item.bidStatus === 'E' && this.bids.length > 0) {
          this.winner = this.bids.reduce((prev, current) =>
            prev.bidAmount > current.bidAmount ? prev : current
          );
        } else if (this.item.bidStatus === 'E' && this.bids.length === 0) {
          this.winner = 'No bidder';
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
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

  formatCountdown(targetDate: string): string {
    const timeLeft = this.getTimeLeft(targetDate);
    if (timeLeft <= 0) {
      window.location.reload();
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
}
