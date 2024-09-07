import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseUrlSevice } from './baseurl.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(
    private httpClient: HttpClient,
    private baseUrlService: BaseUrlSevice
  ) {}

  async performTransaction(transactionData: any) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return lastValueFrom(
      this.httpClient.post(
        this.baseUrlService.BASE_URL + 'account/transaction',
        transactionData,
        { headers }
      )
    );
  }

  async filterTransactions(
    accId: string,
    transType?: string,
    startDate?: string,
    endDate?: string
  ) {
    let params = new HttpParams();
    params = params.set('accId', accId);
    if (transType) {
      params = params.set('transType', transType);
    }

    if (startDate) {
      params = params.set('startDate', startDate);
    }

    if (endDate) {
      params = params.set('endDate', endDate);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return lastValueFrom(
      this.httpClient.get(
        this.baseUrlService.BASE_URL + 'transaction/transactions',
        { params, headers }
      )
    );
  }
}
