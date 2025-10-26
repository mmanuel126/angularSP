import { of as observableOf, throwError, Subject, Observable } from 'rxjs';
import { AppService } from '../../../core/services/general/app.service';
import { catchError, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessagesService } from '../../../core/services/data/messages.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  public webSiteDomain = environment.webSiteDomain;
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  autoCompleteModel = new AutoCompleteModel();
  public flag: boolean = true;
  public entities!: Observable<any[]>;
  private searchEntities = new Subject<string>();
  userId: string;
  logoImage: string;
  memberImagesUrlPath: string;
  msgBadgeCnt: string = '0';
  msgCntText: string = '';

  constructor(
    public session: SessionMgtService,
    private router: Router,
    public msgSvc: MessagesService,
    public contactSvc: ContactsService,
    private appService: AppService
  ) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
    if (this.session.getSessionVal('userImage') == null) {
      this.session.setSessionVar('userImage', 'default.png');
    }
    this.userId = this.session.getSessionVal('userID');
    this.logoImage = environment.appLogo;
    this.getUnReadMessagesCount(this.userId);
  }

  isCollapsed = true;
  isCollapsedPin = false;

  ngOnInit() {
    let entities = this.searchEntities.pipe(
      debounceTime(300), // wait for 300ms pause in events
      distinctUntilChanged(), // ignore if next search term is same as previous
      switchMap((term) =>
        term // switch to new observable each time
          ? // return the http search observable
            this.contactSvc.getSearchList(this.userId, term)
          : // or the observable of empty heroes if no search term
            observableOf<any[]>([])
      ),
      catchError((error) => {
        // do real error handling
        console.log(error);
        return observableOf<any[]>([]);
      })
    );
    this.entities = entities;
  }

  getUnReadMessagesCount(id: string) {
    this.msgSvc.getUnReadMessagesCount(id).subscribe({
      next: (count: string) => {
        this.msgBadgeCnt = count;
        if (this.msgBadgeCnt == '0') {
          this.msgCntText = 'You have ' + this.msgBadgeCnt + ' un-read message!';
        } else if (this.msgBadgeCnt != '') {
          this.msgCntText = 'You have ' + this.msgBadgeCnt + ' un-read messages!';
        } else {
          this.msgCntText = '';
        }
      },
      error: (err) => {
        console.error('Failed to get unread message count:', err);
        this.msgBadgeCnt = '';
        this.msgCntText = '';
      },
    });
  }

  toggleSidebarPin() {
    this.appService.toggleSidebarPin();
    if (this.isCollapsedPin) {
      this.isCollapsedPin = false;
    } else {
      this.isCollapsedPin = true;
    }
  }

  toggleSidebar() {
    this.appService.toggleSidebar();
  }

  doShowProfile(memberId: string) {
    this.router.navigate(['members/view-profile/show-profile'], {
      queryParams: { memberID: memberId },
    });
    return false;
  }

  doLogoff(): void {
    const keysToClear = ['isUserLogin', 'userID', 'userEmail', 'userImage', 'pwd'];
    keysToClear.forEach((key) => this.session.setSessionVar(key, ''));
    // Optionally clear all session variables if applicable
    // this.session.clear(); // <- if you want to clear everything
    this.router.navigate(['/']);
  }

  // Push a search term into the observable stream.
  searchEntity(name: string): void {
    this.flag = true;
    this.searchEntities.next(name);
  }

  onselectEntity(name: string, id: string | number, type: string): boolean {
    this.autoCompleteModel.id = id.toString();
    this.flag = false;
    this.session.setSessionVar('memID', id.toString());
    this.autoCompleteModel.name = '';
    this.router.navigate(['members/view-profile/show-profile'], {
      queryParams: { memberID: id },
    });
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    return false;
  }

  doSearch() {
    let sTxt = this.autoCompleteModel.name;
    this.autoCompleteModel.name = '';
    this.router.navigate(['connections/search-results'], { queryParams: { searchText: sTxt } });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    return false;
  }

  public getSearchResult() {
    let sTxt = this.autoCompleteModel.name;
    this.autoCompleteModel.name = '';
    this.router.navigate(['members/view-profile/show-profile'], {
      queryParams: { searchText: sTxt },
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    return false;
  }
}

export class AutoCompleteModel {
  name!: string;
  id!: string;
}
