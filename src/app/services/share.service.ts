import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private categoryIdSource = new BehaviorSubject<number | null>(null);
  currentCategoryId = this.categoryIdSource.asObservable();

  constructor() {}

  changeCategoryId(categoryId: number) {
    this.categoryIdSource.next(categoryId);
  }
}
