import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/general/common.service';
import { Contact, SearchResult } from '../../models/contacts/contact-model';
import { Search } from '../../models/contacts/search-model';
import { environment } from '../../../../environments/environment';
import { lastValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class ContactsService {
  CONTACT_SERVICE_URI: string = environment.webServiceURL + 'contact/';
  CONTACT_SERVICE_URI2: string = environment.webServiceURL + 'contact/';
  requestQuery: string = '';

  constructor(public httpClient: HttpClient, public common: CommonService) {}

  getMyContacts(memberID: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}contacts?memberID=${memberID}&show=all`;

    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  searchMemberContacts(memberID: string, searchText: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}search-member-contacts?memberID=${memberID}&searchText=${searchText}`;

    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getSearchResults(memberID: string, searchText: string): Observable<Array<SearchResult>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}search-results?memberID=${memberID}&searchText=${searchText}`;

    return this.httpClient.get<Array<SearchResult>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getMySuggestions(memberId: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}suggestions?memberID=${memberId}`;
    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getPeopleIFollow(memberId: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}people-iam-following?memberID=${memberId}`;
    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getPeopleFollowingMe(memberId: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}whose-following-me?memberID=${memberId}`;
    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  followContact(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}follow-member?memberID=${memberId}&contactID=${contactId}`;
    return this.httpClient.post(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  unFollowMember(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}unfollow-member?memberID=${memberId}&contactID=${contactId}`;
    return this.httpClient.post(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  isFollowingContact(memberId: string, contactId: string): Observable<string> {
    const requestQuery = `${this.CONTACT_SERVICE_URI}is-following-contact?memberID=${memberId}&contactID=${contactId}`;

    return this.httpClient
      .get(requestQuery, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
        responseType: 'text',
      })
      .pipe(map((response) => response.toString()));
  }

  deleteContact(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}delete-contact?memberID=${memberId}&contactID=${contactId}`;

    return this.httpClient.delete(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getContactRequests(memberId: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}requests?memberID=${memberId}`;
    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  acceptRequest(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}accept-request?memberID=${memberId}&contactID=${contactId}`;
    return this.httpClient.post(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  rejectRequest(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}reject-request?memberID=${memberId}&contactID=${contactId}`;
    return this.httpClient.post(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getSearchContact(memberId: string, searchText: string): Observable<Array<Contact>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}search-contacts?userID=${memberId}&searchText=${searchText}`;
    return this.httpClient.get<Array<Contact>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  addContact(memberId: string, contactId: string): Observable<any> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}send-request?memberID=${memberId}&contactID=${contactId}`;
    return this.httpClient.put(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getSearchList(memberId: string, searchText: string): Observable<Array<Search>> {
    this.requestQuery = `${this.CONTACT_SERVICE_URI}search-results?memberID=${memberId}&searchText=${searchText}`;
    return this.httpClient.get<Array<Search>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }
}
