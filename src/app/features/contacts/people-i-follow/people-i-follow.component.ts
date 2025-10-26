import { Component, ViewChild, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { Contact } from '../../../core/models/contacts/contact-model';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-people-i-follow',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [ContactsService],
  templateUrl: './people-i-follow.component.html',
  styleUrl: './people-i-follow.component.css',
})
export class PeopleIFollowComponent {
  public memberId: string = '';
  public contactCnt: number = 0;
  public contactInfoList!: Contact[];
  public spinner: boolean = false;
  public contactId = '';

  showErrMsg: boolean = false;
  errMsg: string = '';
  showModalBox: boolean = false;
  @ViewChild('closebutton') closebutton: any;
  searchModel = new SearchModel();
  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(private session: SessionMgtService, public contactSvc: ContactsService) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getPeopleIFollow(this.memberId);
  }

  getPeopleIFollow(memberId: string) {
    this.contactSvc.getPeopleIFollow(memberId).subscribe({
      next: (followers) => {
        this.contactInfoList = followers;
        if (this.contactInfoList != null) {
          this.contactCnt = this.contactInfoList.length;
        }
      },
      error: (err) => {
        console.error('Error fetching followers:', err);
      },
    });
  }

  showUnfollowPopup(id: any) {
    this.contactId = id;
    this.showModalBox = true;
    const modEl = document.getElementById('unfollowModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  doUnfollowMember() {
    this.spinner = true;
    this.contactSvc.unFollowMember(this.memberId, this.contactId).subscribe();
    this.getPeopleIFollow(this.memberId);
    this.closebutton.nativeElement.click();
    this.spinner = false;
    return false;
  }
}

export class SearchModel {
  key: string = '';
}
