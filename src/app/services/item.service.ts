import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrlSevice } from './baseurl.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  http: any;
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}
  createItem(itemData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}items/create`,
      itemData,
      { headers }
    );
  }

  getAllItems(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrlService.BASE_URL}items`);
  }

  searchItems(query: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrlService.BASE_URL}items/search`, {
      params: { query },
    });
  }

  searchItemsByCateId(categoryId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrlService.BASE_URL}items/search`, {
      params: { categoryId },
    });
  }

  getItemById(itemId: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrlService.BASE_URL}items/${itemId}`
    );
  }
}
