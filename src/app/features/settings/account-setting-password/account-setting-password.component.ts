import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { Register } from '../../../core/models/register.model';
import { SettingsService } from '../../../core/services/data/settings.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-password.component.html',
  styleUrl: './account-setting-password.component.css',
})
export class AccountSettingPasswordComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  public isPwdSuccess = false;
  public isValidPwd = true;

  asModel = new Register();

  public constructor(
    public session: SessionMgtService,
    private route: ActivatedRoute,
    private router: Router,
    public setSvc: SettingsService
  ) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
  }

  saveASPassword(frm: NgForm) {
    this.isPwdSuccess = false;
    this.isSaving = true;
    if (!this.asModel.code.includes(this.session.getSessionVal('pwd'))) {
      this.isValidPwd = false;
    } else {
      this.setSvc.SavePasswordInfo(this.memberID, this.asModel.password).subscribe();
    }
    this.isSaving = false;
    this.isPwdSuccess = true;
  }
}
