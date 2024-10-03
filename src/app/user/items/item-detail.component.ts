import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { BidService } from '../../services/bid.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

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
  user: any = JSON.parse(localStorage.getItem('user') || 'null');
  seller: any;
  ratingScore: number = 5; // Default score
  comments: string = '';
  showExistingRating: boolean = false;
  showRatingForm: boolean = false;
  countdownInterval: any;

  constructor(
    private itemService: ItemService,
    private bidService: BidService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadData(); // Đặt logic tải dữ liệu trong một phương thức riêng

    // Bắt đầu countdown
    this.startCountdown();
  }

  // Tải lại dữ liệu khi cần
  loadData(callback?: () => void): void {
    forkJoin([
      this.itemService.getItemById(this.itemId),
      this.bidService.getBidHistory(this.itemId),
    ]).subscribe({
      next: ([item, bids]) => {
        this.item = item;
        this.bids = bids;
        this.loadSellerInfo(item.sellerUsername);
        if (this.item && this.item.images.length > 0) {
          this.currentImage = this.item.images[this.currentImageIndex];
        }
        if (this.item.bidStatus === 'E' && this.bids.length > 0) {
          this.winner = this.bids.reduce((prev, current) =>
            prev.bidAmount > current.bidAmount ? prev : current
          );
          this.checkUserRating();
        } else if (this.item.bidStatus === 'E' && this.bids.length === 0) {
          this.winner = 'No bidder';
        }

        // Nếu có callback, gọi callback sau khi load xong dữ liệu
        if (callback) {
          callback();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.item) {
        let timeLeft: number;

        // Kiểm tra trạng thái bidStatus
        if (this.item.bidStatus === 'I') {
          timeLeft = this.getTimeLeft(this.item.bidStartDate);
        } else if (this.item.bidStatus === 'A') {
          timeLeft = this.getTimeLeft(this.item.bidEndDate);
        } else {
          clearInterval(this.countdownInterval);
          return; // Dừng interval nếu không hợp lệ
        }

        if (timeLeft <= 0) {
          clearInterval(this.countdownInterval); // Dừng interval

          if (this.item.bidStatus === 'I' || this.item.bidStatus === 'A') {
            // Nếu trạng thái hiện tại là 'I' hoặc 'A', tải lại dữ liệu
            this.loadData(() => {
              // Sau khi dữ liệu được tải lại, kiểm tra lại trạng thái bidStatus
              if (
                (this.item && this.item.bidStatus === 'A') ||
                (this.item && this.item.bidStatus === 'I')
              ) {
                this.startCountdown();
              }
            });
          } else {
            // Nếu trạng thái là 'E' thì chỉ tải lại dữ liệu
            this.loadData();
          }
        }
      }
    }, 1000); // Đếm ngược mỗi giây
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

  submitRating(): void {
    if (this.item && this.winner && this.ratingScore > 0) {
      const ratedUserId = this.item.sellerId;
      const ratedByUserId = this.winner.bidderId;

      this.userService
        .createRating(
          ratedUserId,
          ratedByUserId,
          this.item.itemId,
          this.ratingScore,
          this.comments
        )
        .subscribe({
          next: () => {
            console.log('Rating submitted successfully.');
            this.checkUserRating();
          },
          error: (err) => {
            console.error('Error submitting rating:', err);
          },
        });
    } else {
      console.error('Invalid rating score or missing item/winner info.');
    }
  }

  checkUserRating(): void {
    this.userService.getRatingByItemId(this.itemId).subscribe({
      next: (ratings) => {
        // Tìm rating của người đánh giá (winner)
        const foundRating = ratings.find(
          (r: any) => r.ratedByUserId === this.winner.bidderId
        );

        // Kiểm tra xem người dùng đang đăng nhập có phải là winner không
        const isWinner = this.user.username === this.winner.bidderUsername;

        if (foundRating) {
          // Nếu tìm thấy rating
          this.showExistingRating = true;
          this.showRatingForm = false;
          this.ratingScore = foundRating.ratingScore;
          this.comments = foundRating.comments;
        } else if (isWinner) {
          // Nếu không tìm thấy rating và người dùng là winner, hiển thị form
          this.showExistingRating = false;
          this.showRatingForm = true;
        } else {
          // Nếu không phải winner, không hiển thị form
          this.showExistingRating = false;
          this.showRatingForm = false;
        }
      },
      error: (err) => {
        console.error('Error checking rating:', err);
        this.showExistingRating = false;
        this.showRatingForm = false;
      },
    });
  }
}
