import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdsModel } from '../../models/ads.model';
import { Observable } from 'rxjs';

@Injectable()
export class AdsService implements IAdsService {
  COMMON_SERVICE_URI: string = environment.webServiceURL + 'common/';
  requestQuery: string = '';

  constructor(public http: HttpClient) {}

  getAds(type: string): Observable<Array<AdsModel>> {
    const requestQuery = `${this.COMMON_SERVICE_URI}ads?type=${type}`;
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      authorization: 'Bearer ' + localStorage.getItem('access_token') || '',
    };
    return this.http.get<Array<AdsModel>>(requestQuery, { headers });
  }
}

export interface IAdsService {
  getAds(type: string): Observable<Array<AdsModel>>;
}
