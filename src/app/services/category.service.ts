import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrlSevice } from './baseurl.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http: any;
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}

  getCategories(): Observable<any> {
    return this.httpClient.get(`${this.baseUrlService.BASE_URL}categories`);
  }
}
