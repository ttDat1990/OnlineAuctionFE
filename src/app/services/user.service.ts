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
  async loginWithGoogle(idToken: string) {
    return lastValueFrom(
      this.httpClient.post(
        this.baseUrlService.BASE_URL + 'users/loginWithGoogle',
        { idToken }
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

    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}ratings`,
      rating
    );
  }

  getRatingByItemId(itemId: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrlService.BASE_URL}ratings/item/${itemId}`
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrlService.BASE_URL}users/forgot`, {
      email,
    });
  }

  resetPassword(
    email: string,
    resetCode: string,
    newPassword: string
  ): Observable<any> {
    const resetData = {
      email,
      resetCode,
      newPassword,
    };

    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}users/reset`,
      resetData
    );
  }
}
