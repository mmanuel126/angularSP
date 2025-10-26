import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrivacySettingProfileComponent } from '../privacy-setting-profile/privacy-setting-profile.component';
import { PrivacySettingSearchComponent } from '../privacy-setting-search/privacy-setting-search.component';
/*import { AccountSettingChangePhotoComponent } from '../account-setting-change-photo/account-setting-change-photo.component';
import { AccountSettingNameComponent } from '../account-setting-name/account-setting-name.component';
import { AccountSettingPasswordComponent } from '../account-setting-password/account-setting-password.component';
import { AccountSettingSecQuestionsComponent } from '../account-setting-sec-questions/account-setting-sec-questions.component';
import { AccountSettingNotificationsComponent } from '../account-setting-notifications/account-setting-notifications.component';
*/

@Component({
  selector: 'app-privacy-setting',
  standalone: true,
  imports: [
    MatTabsModule,
    FormsModule,
    CommonModule,
    PrivacySettingProfileComponent,
    PrivacySettingSearchComponent,
  ],
  templateUrl: './privacy-setting.component.html',
  styleUrl: './privacy-setting.component.css',
})
export class PrivacySettingComponent {
  constructor(public session: SessionMgtService, private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
