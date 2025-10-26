import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { States } from '../../models/states.model';
import { SportsList } from '../../models/members/profile-member.model';
import { SchoolsByState } from '../../models/organization/schools-by-state.model';
import { RecentNews } from '../../models/recent-news.model';
import { firstValueFrom, lastValueFrom, map, Observable, of } from 'rxjs';

@Injectable()
export class CommonService implements ICommonService {
  COMMON_SERVICE_URI: string = environment.webServiceURL + 'common/';
  requestQuery: string = '';

  constructor(public http: HttpClient) {}

  async encryptString(str: string) {
    this.requestQuery = `${this.COMMON_SERVICE_URI}EncryptString?encrypt=${str}`;
    let response = await firstValueFrom(
      this.http.get(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'text',
      })
    );
    return response.toString();
  }

  async decryptString(str: string) {
    this.requestQuery = `${this.COMMON_SERVICE_URI}DecryptString?encrypted=${str}`;
    let response = await firstValueFrom(
      this.http.get(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        responseType: 'text',
      })
    );
    return response.toString();
  }

  getSportsList(): Observable<Array<SportsList>> {
    this.requestQuery = `${this.COMMON_SERVICE_URI}sports`;

    return this.http.get<Array<SportsList>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getStates(): Observable<Array<States>> {
    this.requestQuery = `${this.COMMON_SERVICE_URI}states`;

    return this.http.get<Array<States>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getSchoolsByState(state: string, instType: string): Observable<Array<SchoolsByState>> {
    this.requestQuery = `${this.COMMON_SERVICE_URI}schools?state=${state}&institutionType=${instType}`;
    return this.http.get<Array<SchoolsByState>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getRecentNews(): Observable<RecentNews[]> {
    this.requestQuery = `${this.COMMON_SERVICE_URI}news`;
    return this.http
      .get<RecentNews[]>(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .pipe(
        map((responseData: any[]) => {
          // Safeguard: ensure response is an array
          if (!Array.isArray(responseData)) {
            console.error('Expected an array but got:', responseData);
            return [];
          }
          return responseData.map((element: any) => {
            const newsItem = new RecentNews();
            newsItem.newsImgUrl = element.imageUrl
              ? element.imageUrl.toString().replace('~', '').replace('Images', 'images')
              : '/images/RecentNews/default.png';
            newsItem.newsTitle = element.headerText ?? '';
            newsItem.newsDatePosted = element.postingDate
              ? `${new Date(element.postingDate).getMonth() + 1}/${new Date(
                  element.postingDate
                ).getDate()}/${new Date(element.postingDate).getFullYear()}`
              : '';
            newsItem.newsDetail = element.textField ? this.truncate(element.textField, 120) : '';
            newsItem.newsUrl = element.navigateUrl ?? '';
            newsItem.newsID = element.id ?? '';
            return newsItem;
          });
        })
      );
  }

  logError(message: string, stack: string): Observable<any> {
    this.requestQuery = `${this.COMMON_SERVICE_URI}Logs`;
    const params = new HttpParams().append('message', message).append('stack', stack);
    return this.http.get(this.requestQuery, { params });
  }

  getYears(maxYear: number, baseYear: number): Observable<number[]> {
    const years: number[] = [];
    for (let i = maxYear; i > baseYear; i--) {
      years.push(i);
    }
    return of(years);
  }

  private truncate(value: string, maxLength: number) {
    if (value == null || value == undefined || value.length == 0) return value;
    return value.length <= maxLength ? value : value.substring(0, maxLength);
  }
}

export interface ICommonService {
  encryptString(str: string): Promise<string>;
  decryptString(str: string): Promise<string>;
  getSportsList(): Observable<Array<SportsList>>;
  getSchoolsByState(state: string, instType: string): Observable<Array<SchoolsByState>>;
  logError(message: string, stack: string): void;
  getYears(maxYear: number, baseYear: number): Observable<number[]>;
  getStates(): Observable<Array<States>>;
  getRecentNews(): Observable<RecentNews[]>;
}
