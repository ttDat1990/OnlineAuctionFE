import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseUrlSevice {
  public BASE_URL = 'http://localhost:5264/api/';
}
