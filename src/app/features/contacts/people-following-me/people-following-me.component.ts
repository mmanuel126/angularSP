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
  selector: 'app-people-following-me',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [ContactsService],
  templateUrl: './people-following-me.component.html',
  styleUrl: './people-following-me.component.css',
})
export class PeopleFollowingMeComponent {
  @ViewChild('closebutton') closebutton: any;

  public memberId: string = '';
  public contactCnt: number = 0;
  public contactInfoList!: Contact[];
  public spinner: boolean = false;
  public contactId = '';

  showModalBox: boolean = false;

  showErrMsg: boolean = false;
  errMsg: string = '';

  public connectionID = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  showAddAsContact: boolean = false;

  constructor(private session: SessionMgtService, public contactSvc: ContactsService) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getPeopleFollowingMe(this.memberId);
  }

  getPeopleFollowingMe(memberId: string) {
    this.contactSvc.getPeopleFollowingMe(memberId).subscribe({
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

  addSearchContactPopup(id: any) {
    this.connectionID = id;
    const modEl = document.getElementById('addModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  sendRequest() {
    this.sendTheRequest();
    this.closebutton.nativeElement.click();
    return false;
  }

  sendTheRequest() {
    this.spinner = true;
    let loggedUserID = this.session.getSessionVal('userID');

    this.contactSvc.addContact(loggedUserID, this.connectionID).subscribe({
      next: () => {
        this.getPeopleFollowingMe(loggedUserID);
        this.spinner = false;
      },
      error: (err) => {
        console.error('Error fetching followers:', err);
      },
    });
  }
}
