import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserModel } from '../../models/user.model';
import { Register } from '../../models/register.model';
import { Login } from '../../models/login.model';
import { SessionMgtService } from '../../services/general/session-mgt.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService implements IAuthService {
  constructor(private httpClient: HttpClient, public session: SessionMgtService) {}

  ACCOUNT_SERVICE_URI: string = environment.webServiceURL + 'account/';
  MEMBERS_SERVICE_URI: string = environment.webServiceURL + 'member/';

  login(_loginModel: Login): Observable<UserModel> {
    const url = `${this.ACCOUNT_SERVICE_URI}login`;
    const data = { email: _loginModel.email, password: _loginModel.password };
    return this.httpClient.post<UserModel>(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  validateNewRegisteredUser(email: string, code: string): Observable<UserModel> {
    const url = `${this.ACCOUNT_SERVICE_URI}login-new-registered-user`;
    const data = { email: email, code: code };
    return this.httpClient.post<UserModel>(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  register(body: Register): Observable<string> {
    const url = `${this.ACCOUNT_SERVICE_URI}register`;
    return this.httpClient.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'text' as const, // Important: use 'as const' for correct typing
    });
  }

  resetPassword(email: string): Observable<string> {
    const url = `${this.ACCOUNT_SERVICE_URI}reset-password?email=${email}`;
    const headers = {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + (localStorage.getItem('access_token') || ''),
    };
    return this.httpClient.get(url, {
      headers,
      responseType: 'text' as const,
    });
  }

  isResetCodeExpired(code: string): Observable<string> {
    const url = `${this.ACCOUNT_SERVICE_URI}is-reset-code-expired?code=${code}`;
    const headers = {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + (localStorage.getItem('access_token') || ''),
    };
    return this.httpClient.get(url, {
      headers,
      responseType: 'text' as const,
    });
  }

  changePassword(model: Register): Observable<string> {
    const url = `${this.ACCOUNT_SERVICE_URI}change-password?pwd=${model.password}&email=${model.email}&code=${model.code}`;
    const headers = {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + (localStorage.getItem('access_token') || ''),
    };
    return this.httpClient.get(url, {
      headers,
      responseType: 'text' as const,
    });
  }

  setMemberStatus(memberId: string, status: string): Observable<string> {
    const url = `${this.ACCOUNT_SERVICE_URI}set-member-status/${memberId}/${status}`;
    const headers = {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + localStorage.getItem('access_token') || '',
    };
    return this.httpClient.put(url, null, {
      headers,
      responseType: 'text' as const,
    });
  }
}

export interface IAuthService {
  login(_loginModel: Login): Observable<UserModel>;
  validateNewRegisteredUser(email: string, code: string): Observable<UserModel>;
  register(body: Register): Observable<string>;
  resetPassword(email: string): Observable<string>;
  isResetCodeExpired(code: string): Observable<string>;
  changePassword(model: Register): Observable<string>;
  setMemberStatus(memberId: string, status: string): void;
}
