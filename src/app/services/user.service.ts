import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
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

  async getAccountByUsername(username: string) {
    return lastValueFrom(
      this.httpClient.get(this.baseUrlService.BASE_URL + 'users/' + username)
    );
  }
}
