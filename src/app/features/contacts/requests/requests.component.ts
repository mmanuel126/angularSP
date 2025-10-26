import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { Contact } from '../../../core/models/contacts/contact-model';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [ContactsService],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css',
})
export class RequestsComponent {
  public memberId: string = '';
  public contactCnt: number = 0;
  public contactInfoList!: Contact[];
  public spinner: boolean = false;
  public contactId = '';

  showErrMsg: boolean = false;
  errMsg: string = '';

  public contacts!: Observable<any[]>;
  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(private session: SessionMgtService, public contactSvc: ContactsService) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getContactRequests(this.memberId);
  }

  getContactRequests(memberId: string) {
    this.contactSvc.getContactRequests(memberId).subscribe({
      next: (contacts) => {
        this.contactInfoList = contacts;
        if (this.contactInfoList != null) {
          this.contactCnt = this.contactInfoList.length;
        }
      },
      error: (err) => {
        console.error('Error fetching contacts:', err);
      },
    });
  }

  acceptRequest(contactId: any) {
    this.acceptTheRequest(contactId);
    return false;
  }

  acceptTheRequest(contactId: any) {
    this.spinner = true;
    this.contactSvc.acceptRequest(this.memberId, contactId).subscribe();
    this.getContactRequests(this.memberId);
    this.spinner = false;
  }

  rejectRequest(contactId: string) {
    this.rejectTheRequest(contactId);
    return false;
  }

  rejectTheRequest(contactId: string) {
    this.spinner = true;
    this.contactSvc.rejectRequest(this.memberId, contactId).subscribe();
    this.getContactRequests(this.memberId);
    this.spinner = false;
  }
}
