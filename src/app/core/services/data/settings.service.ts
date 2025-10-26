import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../services/general/common.service';
import { environment } from '../../../../environments/environment';
import { AccountSettingsInfo } from '../../models/settings/account-settings-info.model';
import { NotificationBody } from '../../models/settings/notifications-setting.model';
import { PrivacySettings } from '../../models/settings/privacy-settings.model';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsService {
  SETTINGS_SERVICE_URI: string = environment.webServiceURL + 'setting/';
  requestQuery!: string;

  constructor(public httpClient: HttpClient, public common: CommonService) {}

  GetMemberNameInfo(memberID: string): Observable<Array<AccountSettingsInfo>> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}name-info/${memberID}`;

    return this.httpClient.get<Array<AccountSettingsInfo>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  GetMemberNotifications(memberID: string): Observable<Array<NotificationBody>> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}notifications/${memberID}`;

    return this.httpClient.get<Array<NotificationBody>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveMemberNameInfo(
    memberID: string,
    firstName: string,
    middleName: string,
    lastName: string
  ): Observable<void> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}update-name-info/${memberID}?fName=${firstName}&mName=${middleName}&lName=${lastName}`;
    return this.httpClient.put<void>(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveMemberEmailInfo(memberID: string, email: string): Observable<void> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}update-email-info/${memberID}?email=${email}`;

    return this.httpClient.put<void>(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SavePasswordInfo(memberID: string, pwd: string): Observable<void> {
    const postBody = {
      memberID,
      pwd,
    };
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}update-password-info`;
    return this.httpClient.put<void>(this.requestQuery, JSON.stringify(postBody), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveSecurityQuestionInfo(memberID: string, question: string, answer: string): Observable<void> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}save-security-question/${memberID}?questionID=${question}&answer=${answer}`;

    return this.httpClient.put<void>(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  DeactivateAccount(memberID: string, reason: string, explanation: string): Observable<void> {
    const futureEmail = 0;
    this.requestQuery = `${
      this.SETTINGS_SERVICE_URI
    }deactivate-account/${memberID}?reason=${encodeURIComponent(
      reason
    )}&explanation=${encodeURIComponent(explanation)}&futureEmail=${futureEmail}`;

    return this.httpClient.post<void>(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveNotificationSettings(memberID: string, body: NotificationBody): Observable<void> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}update-notifications/${memberID}`;
    const data = {
      memberID: memberID,
      sendMsg: body.sendMsg ? 1 : 0,
      addAsFriend: body.addAsFriend ? 1 : 0,
      confirmFriendShipRequest: body.confirmFriendShipRequest ? 1 : 0,
      repliesToYourHelpQuest: body.repliesToYourHelpQuest ? 1 : 0,
    };
    const requestData = JSON.stringify(data);
    return this.httpClient.put<void>(this.requestQuery, requestData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  GetProfileSettings(memberID: string): Observable<Array<PrivacySettings>> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}profile-settings/${memberID}`;

    return this.httpClient.get<Array<PrivacySettings>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveProfileSettings(memberID: string, body: PrivacySettings): Observable<any> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}save-profile-settings/${memberID}`;
    const requestData = JSON.stringify(body);

    return this.httpClient.put(this.requestQuery, requestData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  GetSearchSettings(memberID: string): Observable<Array<PrivacySettings>> {
    this.requestQuery = `${this.SETTINGS_SERVICE_URI}privacy-search-settings/${memberID}`;

    return this.httpClient.get<Array<PrivacySettings>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  SaveSearchSettings(memberID: string, body: PrivacySettings): Observable<void> {
    this.requestQuery =
      `${this.SETTINGS_SERVICE_URI}save-privacy-search-settings/${memberID}` +
      `?visibility=${body.visibility}` +
      `&viewProfilePicture=${body.viewProfilePicture ? 1 : 0}` +
      `&viewFriendsList=${body.viewFriendsList ? 1 : 0}` +
      `&viewLinkToRequestAddingYouAsFriend=${body.viewLinksToRequestAddingYouAsFriend ? 1 : 0}` +
      `&viewLinkToSendYouMsg=${body.viewLinkTSendYouMsg ? 1 : 0}`;
    return this.httpClient.put<void>(this.requestQuery, null, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
      },
    });
  }

  UploadProfilePhoto(memberId: string, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('image', file);
    const requestUrl = `${this.SETTINGS_SERVICE_URI}upload-photo/${memberId}`;
    return this.httpClient.post(requestUrl, fd, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
