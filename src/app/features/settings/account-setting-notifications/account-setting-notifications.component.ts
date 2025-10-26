import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import {
  NotificationsSetting,
  NotificationBody,
} from '../../../core/models/settings/notifications-setting.model';
import { SettingsService } from '../../../core/services/data/settings.service';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-notifications',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-notifications.component.html',
  styleUrl: './account-setting-notifications.component.css',
})
export class AccountSettingNotificationsComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  isNotificationSuccess: boolean | null = null;
  webSiteName = environment.appLogoText;

  asModelList = new Array<NotificationBody>();
  public asModel = new NotificationBody();

  public constructor(public session: SessionMgtService, public setSvc: SettingsService) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getMemberNotificationSettings();
  }

  getMemberNotificationSettings() {
    this.setSvc.GetMemberNotifications(this.memberID).subscribe({
      next: (info) => {
        if (info.length != 0) this.asModel = info[0];
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
      },
    });
  }

  saveASNotifications() {
    this.isNotificationSuccess = null;
    this.isSaving = true;
    this.setSvc.SaveNotificationSettings(this.memberID, this.asModel).subscribe({
      next: () => {
        this.isSaving = false;
        this.isNotificationSuccess = true;
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
        this.isSaving = false;
        this.isNotificationSuccess = false;
      },
    });
  }
}
