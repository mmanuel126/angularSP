import { of as observableOf, Subject, Observable } from 'rxjs';
import { catchError, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, ViewChild, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { MessagesService } from '../../../core/services/data/messages.service';
import { SearchMessageInfo } from '../../../core/models/messages/search-message-info.model';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { environment } from '../../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-view-messages',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  providers: [MessagesService],
  templateUrl: './view-messages.component.html',
  styleUrl: './view-messages.component.css',
})
export class ViewMessagesComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closeNewButton') closeNewButton: any;

  public memberId: string = '';
  public msgCnt: number = 0;
  public messageInfoList!: SearchMessageInfo[];
  public textWeightVal: string = 'none';
  public textWeightShowVal: string = 'all';
  public spinner: boolean = false;
  public dateTime: string = '';
  public subject: string = '';
  public body: string = '';
  public senderId: string = '';
  public senderImage: string = '';
  public senderName: string = '';
  public messageId: string = '';

  showErrMsg: boolean = false;
  errMsg: string = '';
  searchModel = new SearchModel();
  msgModel = new MessageModel();
  autoCompleteModel = new AutoCompleteModel();

  public contacts!: Observable<any[]>;
  private searchContacts = new Subject<string>();
  public contactName = '';
  public flag: boolean = true;

  public memImageUrlPath: string = environment.memberImagesUrlPath;

  constructor(
    private session: SessionMgtService,
    public msgSvc: MessagesService,
    public contactSvc: ContactsService /*, public ngbMod: NgbModal*/
  ) {}

  ngOnInit() {
    this.memberId = this.session.getSessionVal('userID');
    this.getMessageItems(this.memberId, 'All');
  }

  getMessageItems(memberID: string, showType: string) {
    this.msgSvc.getMemberMessages(memberID, showType).subscribe({
      next: (messages) => {
        this.messageInfoList = messages;
        this.msgCnt = this.messageInfoList.length;
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      },
    });
  }

  toggleMsgStatus(status: string, msgID: string) {
    this.msgSvc.toggleMessageState(status, msgID).subscribe({
      next: () => {
        console.log('Message state toggled successfully.');
      },
      error: (err) => {
        console.error('Failed to toggle message state:', err);
      },
    });
  }

  getMessages(memberID: string, type: string, showType: string) {
    if (showType == 'All') {
      this.textWeightShowVal = 'all';
    } else {
      this.textWeightShowVal = 'unRead';
    }
    this.getMessageItems(memberID, showType);
    return false;
  }

  markItem(showType: string, msgID: string) {
    if (showType == 'Read') {
      this.toggleMsgStatus('1', msgID);
    }
    if (showType == 'UnRead') {
      this.toggleMsgStatus('0', msgID);
    }

    this.getMessageItems(this.memberId, 'All');
    return false;
  }

  selectAll() {
    for (const element of this.messageInfoList) {
      element.selected = true;
    }
    this.textWeightVal = 'all';
    return false;
  }

  selectNone() {
    for (const element of this.messageInfoList) {
      element.selected = false;
    }
    this.textWeightVal = 'none';
    return false;
  }

  markBoxes(showType: string) {
    this.markAsCheckBoxes(showType);
    return false;
  }

  markAsCheckBoxes(showType: string) {
    this.spinner = true;
    for (const element of this.messageInfoList) {
      if (element.selected) {
        if (showType == 'Read') {
          this.toggleMsgStatus('1', element.messageID);
        } else {
          this.toggleMsgStatus('0', element.messageID);
        }
      }
    }
    location.reload();
  }

  doSearch() {
    if (!this.searchModel.key) {
      this.getMessageItems(this.memberId, 'All');
    } else {
      this.getSearchMessages(this.memberId, this.searchModel.key);
    }
  }

  getSearchMessages(memberID: string, searchKey: string) {
    this.spinner = true;
    this.msgSvc.searchMessage(memberID, searchKey).subscribe({
      next: (messages) => {
        this.messageInfoList = messages;
        this.msgCnt = this.messageInfoList.length;
      },
      error: (err) => {
        console.error('Error searching messages:', err);
      },
    });
    this.spinner = false;
  }

  DeleteItem(msgId: string) {
    this.DeleteMessage(msgId);
    return false;
  }

  DeleteMessage(msgId: string) {
    this.spinner = true;
    this.msgSvc.deleteMessage(msgId).subscribe({
      next: () => {
        console.log('Message deleted successfully.');
      },
      error: (err) => {
        console.error('Error deleting message:', err);
      },
    });
    location.reload();
  }

  DeleteItems() {
    this.DeleteMessages();
    return false;
  }

  DeleteMessages() {
    this.spinner = true;
    for (const element of this.messageInfoList) {
      if (element.selected) {
        this.msgSvc.deleteMessage(element.messageID).subscribe();
      }
    }
    location.reload();
  }

  showNewMessagePopup() {
    this.autoCompleteModel = new AutoCompleteModel();
    let contacts = this.searchContacts.pipe(
      debounceTime(300), // wait for 300ms pause in events
      distinctUntilChanged(), // ignore if next search term is same as previous
      switchMap((term) =>
        term // switch to new observable each time
          ? // return the http search observable
            this.contactSvc.searchMemberContacts(this.memberId, term)
          : // or the observable of empty heroes if no search term
            observableOf<any[]>([])
      ),
      catchError((error) => {
        // real error handling to do
        console.log(error);
        return observableOf<any[]>([]);
      })
    );
    this.contacts = contacts;
    const modEl = document.getElementById('newMsgModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  // Push a search term into the observable stream.
  searchContact(name: string): void {
    this.flag = true;
    this.searchContacts.next(this.autoCompleteModel.name);
  }

  onselectContact(name: string, id: string) {
    this.autoCompleteModel.name = name;
    this.autoCompleteModel.id = id;
    this.flag = false;
    return false;
  }

  showOpenMessagePopup(
    fromID: string,
    fromImage: string,
    fromName: string,
    subject: string,
    dateTime: string,
    body: string,
    msgID: string
  ) {
    this.senderId = fromID;
    this.senderImage = fromImage;
    this.senderName = fromName;
    this.subject = subject;
    this.dateTime = dateTime;
    this.body = body;
    this.messageId = msgID;
    this.toggleMsgStatus('1', msgID);
    this.getMessageItems(this.memberId, 'All');
    return false;
  }

  sendNewMsg() {
    console.log('id:');
    console.log(this.autoCompleteModel.id);
    if (this.autoCompleteModel.id == null || this.autoCompleteModel.id == '') {
      this.showErrMsg = true;
      this.errMsg = 'Selected contact to send message is not valid!';
    } else {
      this.showErrMsg = false;
      this.spinner = true;
      this.msgSvc
        .sendMessage(
          this.memberId,
          this.autoCompleteModel.id,
          this.msgModel.subject,
          this.msgModel.message
        )
        .subscribe();
      this.autoCompleteModel.id = '';
      this.autoCompleteModel.name = '';
      this.msgModel.message = '';
      this.msgModel.subject = '';
      this.msgModel.toId = '';
      this.spinner = false;
      this.closeNewButton.nativeElement.click();
      this.getMessageItems(this.memberId, 'All');
    }
  }

  SendMessage() {
    this.spinner = true;
    let msg = this.msgModel.message;
    this.msgSvc.sendMessage(this.memberId, this.senderId, this.subject, msg).subscribe();
    this.closebutton.nativeElement.click();
    this.msgModel.message = '';
    this.getMessageItems(this.memberId, 'All');
    this.spinner = false;
    return false;
  }
}

export class SearchModel {
  key: string = '';
}

export class MessageModel {
  message: string = '';
  toId: string = '';
  subject: string = '';
}

export class AutoCompleteModel {
  name: string = '';
  id: string = '';
}
