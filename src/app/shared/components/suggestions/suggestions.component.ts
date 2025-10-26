import { Component, OnInit, ViewChild } from '@angular/core';
import { Contact } from '../../../core/models/contacts/contact-model';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [RouterModule],
  providers: [ContactsService],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css',
})
export class SuggestionsComponent {
  showConnectModalBox: boolean = false;
  connectionID: string = '0';
  public isSaving: boolean = false;
  public contactInfoList!: Contact[];
  public memberImagesUrlPath: string;

  constructor(public contactSvc: ContactsService, private session: SessionMgtService) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit() {
    let memberId = this.session.getSessionVal('userID');
    this.getMySuggestions(memberId);
  }

  getMySuggestions(memberId: string) {
    this.contactSvc.getMySuggestions(memberId).subscribe({
      next: (data) => {
        this.contactInfoList = data;
      },
      error: (err) => {
        console.error('Error fetching suggestions:', err);
      },
    });
  }

  doFollowMember(contactID: string) {
    let loggedUserID = this.session.getSessionVal('userID');
    this.contactSvc.followContact(loggedUserID, contactID).subscribe();
    this.getMySuggestions(loggedUserID);
    return false;
  }

  jumpConnectMember(id: string) {
    this.connectionID = id;
    let loggedUserID = this.session.getSessionVal('userID');
    this.getMySuggestions(loggedUserID);
    return false;
  }
}
