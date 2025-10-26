import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { ContactsService } from '../../../core/services/data/contacts.service';
import { SearchResult } from '../../../core/models/contacts/contact-model';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [ContactsService],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
  public memberId: string = '';
  public contactCnt: number = 0;
  public contactInfoList!: SearchResult[];
  public spinner: boolean = false;
  public contactId = '';

  showErrMsg: boolean = false;
  errMsg: string = '';

  searchModel = new SearchModel();
  autoCompleteModel = new AutoCompleteModel();

  public contactName = '';
  public flag: boolean = true;
  public memberImagesUrlPath: string;

  constructor(
    private route: ActivatedRoute,
    private session: SessionMgtService,
    public contactSvc: ContactsService
  ) {
    this.memberImagesUrlPath = environment.memberImagesUrlPath;
  }

  ngOnInit(): void {
    this.memberId = this.session.getSessionVal('userID');
    this.route.queryParams.subscribe((params) => {
      this.searchModel.key = params['searchText'];
    });
    this.getSearchResults();
  }

  async getSearchResults() {
    this.spinner = true;
    this.contactSvc.getSearchResults(this.memberId, this.searchModel.key).subscribe({
      next: (results) => {
        this.contactInfoList = results;
        this.contactCnt = this.contactInfoList.length;
      },
      error: (err) => {
        console.error('Failed to fetch search results:', err);
      },
    });
    this.spinner = false;
  }
}

export class SearchModel {
  key: string = '';
}

export class AutoCompleteModel {
  name: string = '';
  id: string = '';
}
