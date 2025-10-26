import { Component, ViewChild, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { Contact } from '../../../core/models/contacts/contact-model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-my-contacts',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [ContactsService],
  templateUrl: './my-contacts.component.html',
  styleUrl: './my-contacts.component.css',
})
export class MyContactsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  public mdlDropContactIsOpen: boolean = false;

  public memberId: string = '';
  public contactCnt: number = 0;
  public contactInfoList!: Contact[];
  public spinner: boolean = false;
  public contactId = '';

  showModalBox: boolean = false;

  showErrMsg: boolean = false;
  errMsg: string = '';

  searchModel = new SearchModel();
  autoCompleteModel = new AutoCompleteModel();

  public connections!: Observable<any[]>;
  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(private session: SessionMgtService, public contactSvc: ContactsService) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.getMyContacts(this.memberId);
  }

  getMyContacts(memberId: string) {
    this.contactSvc.getMyContacts(memberId).subscribe({
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

  doSearch() {
    this.getSearchContacts(this.memberId, this.searchModel.key);
  }

  async getSearchContacts(memberID: string, searchKey: string) {
    this.spinner = true;
    if (searchKey == undefined || searchKey == '') {
      this.getMyContacts(memberID);
    } else {
      this.contactSvc.searchMemberContacts(memberID, searchKey).subscribe({
        next: (contacts) => {
          this.contactInfoList = contacts;
        },
        error: (err) => {
          console.error('Error searching member contacts:', err);
        },
      });
    }
    if (this.contactInfoList != null) {
      this.contactCnt = this.contactInfoList.length;
    }
    this.spinner = false;
  }

  showDropContactPopup(contactID: string) {
    this.contactId = contactID;
    this.showModalBox = true;

    const modEl = document.getElementById('removeModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  doRemoveConnection() {
    this.spinner = true;

    this.contactSvc.deleteContact(this.memberId, this.contactId).subscribe({
      next: () => {
        this.getMyContacts(this.memberId);
        this.closebutton.nativeElement.click();
        this.spinner = false;
      },
      error: (err) => {
        console.error('Error deleting contact:', err);
      },
    });
    return false;
  }

  doCancel() {
    this.mdlDropContactIsOpen = false;
  }
}

export class SearchModel {
  key: string = '';
}

export class AutoCompleteModel {
  name: string = '';
  id: string = '';
}
