import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { SettingsService } from '../../../core/services/data/settings.service';
import { PrivacySettings } from '../../../core/models/settings/privacy-settings.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-setting-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './privacy-setting-search.component.html',
  styleUrl: './privacy-setting-search.component.css',
})
export class PrivacySettingSearchComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving: boolean = false;
  public isSearchSuccess: boolean | null = null;

  asModelList = new Array<PrivacySettings>();
  asModel = new PrivacySettings();

  public constructor(public session: SessionMgtService, public setSvc: SettingsService) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getSearchSettings();
  }

  getSearchSettings() {
    this.setSvc.GetSearchSettings(this.memberID).subscribe({
      next: (info) => {
        this.asModel = info[0];
      },
      error: (error) => {
        console.error('Get search settings failed:', error);
      },
    });
  }

  saveSearchSettings() {
    this.isSaving = true;
    this.isSearchSuccess = null;
    this.setSvc.SaveSearchSettings(this.memberID, this.asModel).subscribe({
      next: () => {
        this.isSaving = false;
        this.isSearchSuccess = true;
      },
      error: (error) => {
        console.error('Save search settings failed:', error);
      },
    });
  }
}
