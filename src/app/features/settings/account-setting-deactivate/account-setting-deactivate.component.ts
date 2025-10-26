import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { SettingsService } from '../../../core/services/data/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-deactivate',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-deactivate.component.html',
  styleUrl: './account-setting-deactivate.component.css',
})
export class AccountSettingDeactivateComponent implements OnInit {
  @ViewChild('closeDeactivateButton') closeDeactivateButton: any;

  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;

  public constructor(
    public session: SessionMgtService,
    private router: Router,
    public setSvc: SettingsService
  ) {}

  memberID!: string;
  asModel = new DeactivateModel();

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.asModel.reason = 'select';
  }

  doDeactivate() {
    this.isSaving = true;
    this.setSvc
      .DeactivateAccount(this.memberID, this.asModel.reason, this.asModel.explanation)
      .subscribe();
    this.isSaving = false;
    //this.modalService.dismissAll(modal);
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
