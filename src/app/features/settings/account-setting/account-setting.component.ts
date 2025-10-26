import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { SettingsService } from '../../../core/services/data/settings.service';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountSettingChangePhotoComponent } from '../account-setting-change-photo/account-setting-change-photo.component';
import { AccountSettingNameComponent } from '../account-setting-name/account-setting-name.component';
import { AccountSettingPasswordComponent } from '../account-setting-password/account-setting-password.component';
import { AccountSettingSecQuestionsComponent } from '../account-setting-sec-questions/account-setting-sec-questions.component';
import { AccountSettingNotificationsComponent } from '../account-setting-notifications/account-setting-notifications.component';

@Component({
  selector: 'app-account-setting',
  standalone: true,
  imports: [
    MatTabsModule,
    FormsModule,
    CommonModule,
    AccountSettingChangePhotoComponent,
    AccountSettingNameComponent,
    AccountSettingPasswordComponent,
    AccountSettingSecQuestionsComponent,
    AccountSettingNotificationsComponent,
  ],
  templateUrl: './account-setting.component.html',
  styleUrl: './account-setting.component.css',
})
export class AccountSettingComponent implements OnInit {
  @ViewChild('closeDeactivateButton') closeDeactivateButton: any;

  public isSaving = false;

  constructor(
    public setSvc: SettingsService,
    public session: SessionMgtService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  memberID!: string;
  asModel = new DeactivateModel();

  ngOnInit(): void {
    this.memberID = this.session.getSessionVal('userID');
    this.asModel.reason = 'select';
  }

  doDeactivate() {
    this.isSaving = true;
    this.setSvc
      .DeactivateAccount(this.memberID, this.asModel.reason, this.asModel.explanation)
      .subscribe();
    this.isSaving = false;
    this.closeDeactivateButton.nativeElement.click();
    this.session.setSessionVar('isUserLogin', '');
    this.session.setSessionVar('userID', '');
    this.session.setSessionVar('userEmail', '');
    this.session.setSessionVar('userImage', '');
    this.session.setSessionVar('pwd', '');
    this.router.navigate(['/']);
  }
}

export class DeactivateModel {
  reason!: string;
  explanation!: string;
}
