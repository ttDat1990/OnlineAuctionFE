import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUrlSevice } from './baseurl.service';

@Injectable({
  providedIn: 'root',
})
export class FavouriteService {
  http: any;
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}

  isItemFavorited(itemId: number, userId: number): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrlService.BASE_URL}favorites/user/${userId}`
    );
  }

  // Kiểm tra xem item có nằm trong mục yêu thích không
  isFavourite(userId: number, itemId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrlService.BASE_URL}favorites/${userId}/isFavourite/${itemId}`);
  }

  // Chuyển đổi trạng thái mục yêu thích
  toggleFavourite(userId: number, itemId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrlService.BASE_URL}favorites/toggle`, { userId, itemId });
  }
}
