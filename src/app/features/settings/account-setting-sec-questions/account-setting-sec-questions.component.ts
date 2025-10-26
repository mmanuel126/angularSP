import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { AccountSettingsInfo } from '../../../core/models/settings/account-settings-info.model';
import { SettingsService } from '../../../core/services/data/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-sec-questions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-sec-questions.component.html',
  styleUrl: './account-setting-sec-questions.component.css',
})
export class AccountSettingSecQuestionsComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  public isSecQuestSuccess = false;

  asModelList = new Array<AccountSettingsInfo>();
  asModel = new AccountSettingsInfo();

  public constructor(public session: SessionMgtService, public setSvc: SettingsService) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.asModel.securityQuestion = 'select';
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

  saveASSecQuestions() {
    this.isSecQuestSuccess = false;
    this.isSaving = true;
    this.setSvc
      .SaveSecurityQuestionInfo(
        this.memberID,
        this.asModel.securityQuestion,
        this.asModel.securityAnswer
      )
      .subscribe();
    this.isSaving = false;
    this.isSecQuestSuccess = true;
  }
}
