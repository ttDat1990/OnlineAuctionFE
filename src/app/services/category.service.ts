import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  createCategory(categoryData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}categories`,
      categoryData,
      { headers }
    );
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.put(
      `${this.baseUrlService.BASE_URL}categories/${id}`,
      categoryData,
      { headers }
    );
  }

  deleteCategory(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.httpClient.delete(
      `${this.baseUrlService.BASE_URL}categories/${id}`,
      { headers }
    );
  }

  mergeCategories(
    targetCategoryId: number,
    sourceCategoryIds: number[]
  ): Observable<any> {
    const mergeData = {
      targetCategoryId,
      sourceCategoryIds,
    };
    return this.httpClient.post(
      `${this.baseUrlService.BASE_URL}categories/merge`,
      mergeData
    );
  }
}
