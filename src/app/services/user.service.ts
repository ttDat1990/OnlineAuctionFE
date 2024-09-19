import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { BaseUrlSevice } from './baseurl.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}
  async login(loginData: any) {
    return lastValueFrom(
      this.httpClient.post(
        this.baseUrlService.BASE_URL + 'users/login',
        loginData
      )
    );
  }
  async register(userData: any) {
    return lastValueFrom(
      this.httpClient.post(
        this.baseUrlService.BASE_URL + 'users/register',
        userData
      )
    );
  }

  getAccountByUsername(username: string): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrlService.BASE_URL}users/${username}`
    );
  }

  createRating(
    ratedUserId: number,
    ratedByUserId: number,
    itemId: number,
    ratingScore: number,
    comments: string
  ): Observable<any> {
    const rating = {
      ratedUserId,
      ratedByUserId,
      itemId,
      ratingScore,
      comments,
    };

    return this.httpClient.post(`${this.baseUrlService.BASE_URL}ratings`, rating);
  }
}
