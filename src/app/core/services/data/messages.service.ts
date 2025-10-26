import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/general/common.service';
import { SearchMessageInfo } from '../../models/messages/search-message-info.model';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable()
export class MessagesService {
  MESSAGES_SERVICE_URI: string = environment.webServiceURL + 'message/';
  requestQuery: string = '';

  constructor(public httpClient: HttpClient, public common: CommonService) {}

  getMemberMessages(memberID: string, showType: string): Observable<Array<SearchMessageInfo>> {
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}messages/${memberID}?showType=${showType}`;
    return this.httpClient.get<Array<SearchMessageInfo>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  toggleMessageState(status: string, msgID: string): Observable<any> {
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}toggle-message-state?status=${status}&msgID=${msgID}`;
    return this.httpClient.put(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  deleteMessage(msgId: string): Observable<any> {
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}delete/${msgId}`;
    return this.httpClient.delete(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  searchMessage(memberId: string, searchKey: string): Observable<Array<SearchMessageInfo>> {
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}search-messages/${memberId}?searchKey=${searchKey}`;
    return this.httpClient.get<Array<SearchMessageInfo>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  sendMessage(memberId: string, senderId: string, subject: string, msg: string): Observable<any> {
    const mesg: MsgInfo = {
      to: senderId,
      from: memberId,
      subject: subject,
      body: msg,
      attachement: '',
      original_msg: '',
      message_id: '',
      sent_date: '',
      sender_picture: '',
    };
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}send-message`;
    return this.httpClient.post(this.requestQuery, mesg, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  getUnReadMessagesCount(memberId: string): Observable<string> {
    this.requestQuery = `${this.MESSAGES_SERVICE_URI}total-unread-messages/${memberId}`;
    return this.httpClient
      .get<number>(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .pipe(map((response: number) => response.toString()));
  }
}

export interface MsgInfo {
  to: string;
  from: string;
  subject: string;
  body: string;
  attachement: string;
  original_msg: string;
  message_id: string;
  sent_date: string;
  sender_picture: string;
}
