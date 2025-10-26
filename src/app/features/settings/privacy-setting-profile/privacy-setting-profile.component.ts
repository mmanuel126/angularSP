import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { PrivacySettings } from '../../../core/models/settings/privacy-settings.model';
import { SettingsService } from '../../../core/services/data/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-setting-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './privacy-setting-profile.component.html',
  styleUrl: './privacy-setting-profile.component.css',
})
export class PrivacySettingProfileComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isProfileSuccess: boolean | null = null;
  public isSaving: boolean = false;

  asModelList = new Array<PrivacySettings>();
  asModel = new PrivacySettings();

  public constructor(
    public session: SessionMgtService,
    private route: ActivatedRoute,
    private router: Router,
    public setSvc: SettingsService
  ) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getProfileSettings();
  }

  getProfileSettings() {
    this.setSvc.GetProfileSettings(this.memberID).subscribe({
      next: (info) => {
        this.asModel = info[0];
      },
      error: (error) => {
        console.error('Get privacy profile settings failed:', error);
      },
    });
  }

  saveProfileSettings() {
    this.isProfileSuccess = null;
    this.isSaving = true;

    this.setSvc.SaveProfileSettings(this.memberID, this.asModel).subscribe({
      next: () => {
        this.isSaving = false;
        this.isProfileSuccess = true;
      },
      error: (error) => {
        console.error('Save privacy profile settings failed:', error);
      },
    });
  }
}
