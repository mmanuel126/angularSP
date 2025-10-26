import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { RecentNews } from '../../core/models/recent-news.model';
import { MembersService } from '../../core/services/data/members.service';
import { CommonService } from '../../core/services/general/common.service';
import { SessionMgtService } from '../../core/services/general/session-mgt.service';
import { Posts } from '../../core/models/recent-posts.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CarouselModule, NgxPaginationModule, CommonModule],
  providers: [MembersService, CommonService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  @ViewChild('closeReplyButton') closeReplyButton: any;
  @ViewChild('closeNewButton') closeNewButton: any;
  @ViewChild('hiddenButton') hiddenButton!: ElementRef;

  showModalBox: boolean = true;

  public mdlNewPostIsOpen: boolean = false;
  public mdlReplyPostIsOpen: boolean = false;
  public webSiteDomain = environment.webSiteDomain;
  recentNews: RecentNews[] = [];
  recentPosts!: Posts[];
  errorMessage: string = '';
  memberID: string = '';
  p: number = 1;
  memberImageUrlpath: string = environment.memberImagesUrlPath;

  postID: string = '';
  public show: boolean = false;

  msgBadgeCnt: string = '';

  postModel: PostModel = {
    postText: '',
  };

  progGressMdl: ProgressModel = {
    labelText: '',
  };

  public constructor(
    private route: ActivatedRoute,
    public httpClient: HttpClient,
    public membersSvc: MembersService,
    private router: Router,
    public common: CommonService,
    public session: SessionMgtService,
    public zone: NgZone
  ) {
    this.memberID = this.session.getSessionVal('userID');
  }

  ngOnInit() {
    this.getRecentData();
  }

  ngAfterViewInit() {
    //hidden button click to check if the user reactivated account
    let isReactivated = this.session.getSessionVal('reactivate');
    if (isReactivated == 'yes') {
      this.hiddenButton.nativeElement.click();
      this.session.setSessionVar('reactivate', 'no');
    }
  }

  getRecentData() {
    this.show = true;
    this.common.getRecentNews().subscribe((data) => {
      this.recentNews = data;
    });
    this.membersSvc.getRecentPosts(this.memberID).subscribe((data) => {
      this.recentPosts = data;
    });
    this.show = false;
  }

  doPost() {
    this.membersSvc.doPost(this.memberID, this.postModel.postText).subscribe(() => {
      this.closeNewButton.nativeElement.click();
      this.show = true;
      this.membersSvc.getRecentPosts(this.memberID).subscribe((data) => {
        this.recentPosts = data;
      });
      this.show = false;
      this.postModel.postText = '';
      return false;
    });
  }

  doCancel() {
    this.mdlNewPostIsOpen = false;
    this.mdlReplyPostIsOpen = false;
  }

  doPostReply() {
    this.membersSvc
      .doPostResponse(this.memberID, this.postID, this.postModel.postText)
      .subscribe(() => {
        this.closeReplyButton.nativeElement.click();
        this.show = true;
        this.membersSvc.getRecentPosts(this.memberID).subscribe((data) => {
          this.recentPosts = data;
        });
        this.show = false;
        this.postModel.postText = '';
        return false;
      });
  }

  refreshPosts() {
    this.show = true;
    this.membersSvc.getRecentPosts(this.memberID).subscribe((data) => {
      this.recentPosts = data;
      this.show = false;
    });
    return false;
  }

  async showMemberProfile(id: string) {
    this.router.navigate(['members/show-profile'], { queryParams: { memberID: id } });
    return false;
  }

  jumpToComment(postID: string) {
    this.postID = postID;
    const modEl = document.getElementById('mdlNewPost');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  jumpToReply(postID: string) {
    this.postID = postID;
    const modEl = document.getElementById('mdlReplyPost');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }
}

export class PostModel {
  postText: string = '';
}

export class ProgressModel {
  labelText: string = '';
}
