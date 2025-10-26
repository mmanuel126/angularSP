import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Posts, PostResponses } from '../../models/recent-posts.model';
import { CommonService } from '../../services/general/common.service';
import { SessionMgtService } from '../../services/general/session-mgt.service';
import {
  MemberProfileBasicInfo,
  YoutubePlayList,
  YoutubeVideosList,
} from '../../models/members/profile-member.model';
import { MemberProfileEducation } from '../../models/members/profile-education.model';
import { MemberProfileContactInfo } from '../../models/members/profile-contact-info.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../services/general/auth.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable()
export class MembersService {
  headers = new HttpHeaders({
    'Content-Type': 'application/text; charset=utf-8',
    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    'Access-Control-Allow-Origin': '*',
  });

  MEMBERS_SERVICE_URI: string = environment.webServiceURL + 'member/';
  ORGANIZATIONS_SERVICE_URI: string = environment.webServiceURL + 'organizations/';
  requestQuery: string = '';

  accessToken = localStorage.getItem('access_token');

  constructor(
    public httpClient: HttpClient,
    public common: CommonService,
    public session: SessionMgtService,
    public auth: AuthService
  ) {}

  getRecentPosts(memberID: string): Observable<Posts[]> {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      authorization: 'Bearer ' + localStorage.getItem('access_token'),
      'Access-Control-Allow-Origin': '*',
    };
    const recentPostsUrl = `${this.MEMBERS_SERVICE_URI}posts/${memberID}`;
    return this.httpClient.get<Posts[]>(recentPostsUrl, { headers }).pipe(
      switchMap((posts: Posts[]) => {
        if (!Array.isArray(posts)) return of([]); // Safety check

        // Map each post into an Observable<RecentPostsModel> that includes its children
        const postObservables = posts.map((post) => {
          const postModel = new Posts();

          postModel.picturePath = post.picturePath ?? '';
          postModel.datePosted = post.datePosted ?? '';
          postModel.description = post.description ?? '';
          postModel.firstName = post.firstName ?? '';
          postModel.memberID = post.memberID ?? '';
          postModel.memberName = post.memberName ?? '';
          postModel.postID = post.postID ?? '';

          const childUrl = `${this.MEMBERS_SERVICE_URI}post-responses/${postModel.postID}`;

          return this.httpClient.get<PostResponses[]>(childUrl, { headers }).pipe(
            map((children: PostResponses[]) => {
              const childModels: PostResponses[] = children.map((child) => {
                const childModel = new PostResponses();
                childModel.picturePath = child.picturePath ?? '';
                childModel.dateResponded = child.dateResponded ?? '';
                childModel.description = child.description ?? '';
                childModel.firstName = child.firstName ?? '';
                childModel.memberID = child.memberID ?? '';
                childModel.memberName = child.memberName ?? '';
                childModel.postID = child.postID ?? '';
                childModel.postResponseID = child.postResponseID ?? '';
                return childModel;
              });

              postModel.children = childModels;
              return postModel;
            }),
            catchError(() => {
              // Fallback if child request fails
              postModel.children = [];
              return of(postModel);
            })
          );
        });
        // Wait for all post observables to complete
        return forkJoin(postObservables);
      }),
      catchError((err) => {
        console.error('Failed to load posts', err);
        return of([]);
      })
    );
  }

  doPost(memberID: string, txt: string): Observable<string> {
    const requestQuery = `${this.MEMBERS_SERVICE_URI}create-post/${memberID}?postMsg=${txt}`;
    return this.httpClient
      .post(requestQuery, null, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .pipe(
        // Ensure the response is converted to a string
        map((response) => response?.toString() ?? '')
      );
  }

  doPostResponse(memberID: string, postID: string, txt: string): Observable<string> {
    const requestQuery = `${this.MEMBERS_SERVICE_URI}create-post-response/${memberID}/${postID}?postMsg=${txt}`;
    return this.httpClient
      .post(requestQuery, null, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
        },
      })
      .pipe(
        // Ensure the response is converted to a string
        map((response) => response?.toString() ?? '')
      );
  }

  getMemberBasicInfo(memberID: string): Observable<MemberProfileBasicInfo> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}general-info/${memberID}`;

    return this.httpClient.get<MemberProfileBasicInfo>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  getMemberContactInfo(memberID: string): Observable<MemberProfileContactInfo> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}contact-info/${memberID}`;

    return this.httpClient.get<MemberProfileContactInfo>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  getMemberEducationInfo(memberID: string): Observable<MemberProfileEducation[]> {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      authorization: 'Bearer ' + localStorage.getItem('access_token'),
      'Access-Control-Allow-Origin': '*',
    };
    const url = `${this.MEMBERS_SERVICE_URI}education-info/${memberID}`;
    return this.httpClient.get<any[]>(url, { headers }).pipe(
      map((response: any[]) => {
        if (!Array.isArray(response)) {
          console.warn('Expected array but got:', response);
          return [];
        }
        return response.map((element: any) => {
          const mp = new MemberProfileEducation();
          mp.schoolID = element['schoolID']?.toString() ?? '';
          mp.schoolName = element['schoolName']?.toString() ?? '';
          mp.schoolAddress = element['schoolAddress']?.toString() ?? '';
          mp.degree = element['degree']?.toString() ?? '';
          mp.degreeTypeID = element['degreeTypeID']?.toString() ?? '';
          mp.major = element['major']?.toString() ?? '';
          mp.webSite = element['schoolImage']?.toString() ?? '';

          if (mp.webSite && !mp.webSite.startsWith('http')) {
            mp.webSite = 'http://' + mp.webSite;
          }

          mp.schoolImage =
            element['schoolImage'] && element['schoolImage'] !== ''
              ? 'https://www.google.com/s2/favicons?domain=' + element['schoolImage']
              : 'http://www.marcman.xyz/assets/images/members/default.png';

          mp.yearClass = element['yearClass']?.toString() ?? '';
          mp.schoolType = element['schoolType']?.toString() ?? '';
          mp.Societies = element['societies']?.toString() ?? '';
          mp.sportLevelType = element['sportLevelType']?.toString() ?? '';

          return mp;
        });
      }),
      catchError((error) => {
        console.error('Error loading member education info:', error);
        return of([]);
      })
    );
  }

  SaveMemberGeneralInfo(memberID: string, body: MemberProfileBasicInfo): Observable<any> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}general-info`;
    return this.httpClient.post(this.requestQuery, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  SaveMemberContactInfo(memberID: string, body: MemberProfileContactInfo): Observable<any> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}contact-info/${memberID}`;
    return this.httpClient.post(this.requestQuery, body, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  AddNewSchool(memberId: string, body: MemberProfileEducation): Observable<any> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}add-school/${memberId}`;
    const requestData = JSON.stringify(body);
    return this.httpClient.post(this.requestQuery, requestData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  UpdateSchool(memberId: string, body: MemberProfileEducation): Observable<any> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}update-school/${memberId}`;
    const requestData = JSON.stringify(body);
    return this.httpClient.put(this.requestQuery, requestData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  RemoveSchool(memberId: string, instId: string, instType: string): Observable<any> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}remove-school?memberID=${memberId}&instID=${instId}&instType=${instType}`;

    return this.httpClient.delete(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  IsFriendByContactID(memberID: string, contactID: string): Observable<string> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}is-friend-by-contact/${memberID}/${contactID}`;
    return this.httpClient.get(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
      responseType: 'text',
    });
  }

  getVideoPlayList(memberID: string): Observable<Array<YoutubePlayList>> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}video-playlist/${memberID}`;
    var ans = this.httpClient.get<Array<YoutubePlayList>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
    return ans;
  }

  getVideosList(playerListID: string): Observable<Array<YoutubeVideosList>> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}youtube-videos/${playerListID}`;

    var res = this.httpClient.get<Array<YoutubeVideosList>>(this.requestQuery, {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
    return res;
  }

  getChannelId(memberID: string): Observable<string> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}youtube-channel/${memberID}`;
    return this.httpClient
      .get(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Access-Control-Allow-Origin': '*',
        },
        responseType: 'text',
      })
      .pipe(
        map((response) => response ?? '') // ensure empty string if null
      );
  }

  getInstagramURL(memberID: string): Observable<string> {
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}instagram-url/${memberID}`;
    return this.httpClient
      .get(this.requestQuery, {
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Access-Control-Allow-Origin': '*',
        },
        responseType: 'text',
      })
      .pipe(
        map((response) => response ?? '') // Return empty string if null
      );
  }

  saveChannelID(memberID: string, channelID: string): Observable<void> {
    const postBody: YoutubeDataModel = {
      memberID,
      channelID,
    };
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}youtube-channel`;
    return this.httpClient.put<void>(this.requestQuery, JSON.stringify(postBody), {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  saveInstagramURL(memberID: string, instagramURL: string): Observable<void> {
    const postBody = {
      memberID,
      Url: instagramURL,
    };
    this.requestQuery = `${this.MEMBERS_SERVICE_URI}instagram-url`;
    return this.httpClient.put<void>(this.requestQuery, JSON.stringify(postBody), {
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('access_token'),
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  private handleError<T>(operation = 'operation', result: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log error
      console.log(`${operation} failed: ${error.message}`);
      return of(result); // Return fallback value
    };
  }
}

export class PostModel {
  memberID: string = '';
  postID: string = '';
  postMsg: string = '';
}

export class YoutubeDataModel {
  memberID: string = '';
  channelID: string = '';
}

export class IgRequestModel {
  client_id: string = '';
  client_secret: string = '';
  grant_type: string = '';
  redirect_uri: string = '';
  code: string = '';
}
