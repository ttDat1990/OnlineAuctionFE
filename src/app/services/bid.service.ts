import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrlSevice } from './baseurl.service';

@Injectable({
  providedIn: 'root',
})
export class BidService {
  http: any;
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}
  getBidHistory(itemId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlService.BASE_URL}bids/${itemId}`);
  }

  submitBid(itemId: number, bidAmount: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const placeBidDto = {
      itemId: itemId,
      bidAmount: bidAmount,
    };
    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}bids`,
      placeBidDto,
      { headers }
    );
  }
}
