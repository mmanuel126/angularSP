import { Component, ViewChild, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { Contact } from '../../../core/models/contacts/contact-model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-find-contacts',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [ContactsService],
  templateUrl: './find-contacts.component.html',
  styleUrl: './find-contacts.component.css',
})
export class FindContactsComponent implements OnInit {
  [x: string]: any;
  @ViewChild('closebutton') closebutton: any;

  public memberId: string = '';
  public contactCnt: number = -1;
  public contactInfoList!: Contact[];
  public searchType: string = '';
  public cntSuggestInfoList!: Contact[];
  public cntSuggestCnt: number = 0;
  public spinner: boolean = false;
  public contactId = '';

  showModalBox: boolean = false;
  showErrMsg: boolean = false;

  errMsg: string = '';
  public contacts!: Observable<any[]>;
  public contactName = '';
  public flag: boolean = true;

  searchModel = new SearchModel();
  public memberImagesUrlPath: string;

  constructor(
    private session: SessionMgtService,
    public contactSvc: ContactsService /*, public ngbMod: NgbModal*/
  ) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit() {
    this.memberId = this.session.getSessionVal('userID');
    this.searchModel.key = '';
  }

  addContact(contactId: string) {
    this.spinner = true;
    this.contactSvc.addContact(this.memberId, contactId).subscribe();
    this.spinner = false;
  }

  addSearchedItem(contactId: string) {
    this.addContact(contactId);
    this.getSearchContacts(this.memberId, this.searchModel.key);
    return false;
  }

  doSearch() {
    if (this.searchModel.key.length != 0) {
      this.getSearchContacts(this.memberId, this.searchModel.key);
    }
  }

  getSearchContacts(memberID: string, searchKey: string) {
    this.spinner = true;
    if (searchKey != undefined || searchKey != '') {
      this.contactSvc.getSearchContact(memberID, searchKey).subscribe({
        next: (contacts) => {
          this.contactInfoList = contacts;
        },
        error: (err) => {
          console.error('Error fetching contacts:', err);
        },
      });
    }
    if (this.contactInfoList != null) {
      this.contactCnt = this.contactInfoList.length;
    } else {
      this.contactCnt = 0;
    }
    this.spinner = false;
  }

  addSearchContactPopup(contactId: string, name: string, type: string) {
    this.contactId = contactId;
    this.contactName = name;
    this.searchType = type;

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
    this.contactSvc.addContact(this.memberId, this.contactId).subscribe();
    this.getSearchContacts(this.memberId, this.searchModel.key);
    this.spinner = false;
  }
}

export class SearchModel {
  key: string = '';
}
