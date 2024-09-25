import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'upcomingBid',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './upcomingBid.component.html',
  styleUrls: ['./upcomingBid.component.css'],
})
export class UpcomingBidComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService, private router: Router) {}

  ngOnInit(): void {
    this.fetchItems();
    interval(1000).subscribe(() => {
      this.items.forEach((item) => {
        if (item.BidStatus === 'A') {
          const timeLeft = this.getTimeLeft(item.BidEndDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'E'; // Chuyển trạng thái sang 'Bidding closed' khi hết thời gian
          }
        } else if (item.BidStatus === 'I') {
          const timeLeft = this.getTimeLeft(item.BidStartDate);
          if (timeLeft <= 0) {
            item.BidStatus = 'A'; // Chuyển trạng thái sang 'Active' khi thời gian bắt đầu đến
          }
        }
      });
    });
  }

  fetchItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => {
        // Filter items with bidStatus 'A'
        const activeItems = data.filter((item) => item.bidStatus === 'A');

        // Sort items by bidStartDate closest to the current date
        activeItems.sort((a, b) => {
          const now = new Date().getTime();
          const diffA = Math.abs(new Date(a.bidStartDate).getTime() - now);
          const diffB = Math.abs(new Date(b.bidStartDate).getTime() - now);
          return diffA - diffB;
        });

        // Take only the top 4 items
        this.items = activeItems.slice(0, 4);

        console.log('test', this.items);
      },
      error: (error) => {
        console.error('Error fetching items', error);
      },
      complete: () => {
        console.log('Item fetching completed');
      },
    });
  }

  formatCountdown(targetDate: string): string {
    const timeLeft = this.getTimeLeft(targetDate);
    if (timeLeft <= 0) {
      window.location.reload();
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
}
