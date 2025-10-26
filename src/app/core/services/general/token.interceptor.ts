import { Injectable } from '@angular/core';
import { throwError, of } from 'rxjs';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpClient,
  HttpInterceptor,
} from '@angular/common/http';

import { AuthService } from '../../services/general/auth.service';
import { Observable, mergeMap } from 'rxjs';
import { SessionMgtService } from '../../services/general/session-mgt.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    public auth: AuthService,
    public session: SessionMgtService,
    public httpClient: HttpClient
  ) {}

  ACCOUNT_SERVICE_URI: string = environment.webServiceURL + 'account/';

  headers = new Headers({
    'Content-Type': 'application/json',
    authorization: 'Bearer ' + localStorage.getItem('access_token'),
  });

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercepted request...');

    const authReq = request.clone({
      headers: request.headers.set(
        'authorization',
        'Bearer ' + localStorage.getItem('access_token')
      ),
    });

    console.log('Sending request with new header now ...');

    return next.handle(authReq).pipe(
      catchError((err) => {
        console.log(err);

        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            const url = `${this.ACCOUNT_SERVICE_URI}refreshLogin?accessToken=${localStorage.getItem(
              'access_token'
            )}`;

            return this.httpClient.post(url, null).pipe(
              mergeMap((data: any) => {
                if (data != null) {
                  localStorage.setItem('access_token', data.accessToken);

                  const clonedReq = request.clone({
                    headers: request.headers.set('authorization', 'Bearer ' + data.accessToken),
                  });

                  return next.handle(clonedReq);
                } else {
                  this.router.navigate(['/errors'], { queryParams: { errType: 'BadToken' } });
                  return throwError(() => new Error('Token refresh failed'));
                }
              }),
              catchError((refreshErr) => {
                // In case the refresh itself fails
                this.router.navigate(['/errors'], {
                  queryParams: { errType: 'TokenRefreshFailed' },
                });
                return throwError(() => refreshErr);
              })
            );
          } else {
            console.log(`HTTP error ${err.status}`);
            return throwError(() => err);
          }
        } else {
          return throwError(() => err);
        }
      })
    );
  }
}
