import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { AccountSettingsInfo } from '../../../core/models/settings/account-settings-info.model';
import { SettingsService } from '../../../core/services/data/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-name',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-name.component.html',
  styleUrl: './account-setting-name.component.css',
})
export class AccountSettingNameComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  public isNameSuccess = false;

  asModelList = new Array<AccountSettingsInfo>();
  asModel = new AccountSettingsInfo();

  public constructor(public session: SessionMgtService, public setSvc: SettingsService) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getAccountSettingInfo();
  }

  async getAccountSettingInfo() {
    this.setSvc.GetMemberNameInfo(this.memberID).subscribe({
      next: (info) => {
        this.asModel = info[0];
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
      },
    });
  }

  saveASName() {
    this.isNameSuccess = false;
    this.isSaving = true;
    this.setSvc
      .SaveMemberNameInfo(
        this.memberID,
        this.asModel.firstName,
        this.asModel.middleName,
        this.asModel.lastName
      )
      .subscribe();
    this.isSaving = false;
    this.isNameSuccess = true;
  }
}
