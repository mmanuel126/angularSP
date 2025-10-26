import { Component, OnInit } from '@angular/core';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { SettingsService } from '../../../core/services/data/settings.service';
import { MembersService } from '../../../core/services/data/members.service';
import { MemberProfileBasicInfo } from '../../../core/models/members/profile-member.model';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-setting-change-photo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './account-setting-change-photo.component.html',
  styleUrl: './account-setting-change-photo.component.css',
})
export class AccountSettingChangePhotoComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public errorMsg: string = '';
  public isSaving = false;

  //basic info variables
  memberID!: string;
  memImage!: string;
  memName!: string;
  memTitle!: string;
  basicInfoModel: MemberProfileBasicInfo = new MemberProfileBasicInfo();

  selectedFile!: File;

  public constructor(
    public session: SessionMgtService,
    public setSvc: SettingsService,
    private membersSvc: MembersService
  ) {}

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getBasicInfo();
  }

  getBasicInfo() {
    this.membersSvc.getMemberBasicInfo(this.memberID).subscribe({
      next: (info) => {
        this.basicInfoModel = info;
        if (this.basicInfoModel.picturePath == null)
          this.memImage = environment.memberImagesUrlPath + 'default.png';
        else this.memImage = environment.memberImagesUrlPath + this.basicInfoModel.picturePath;

        this.memTitle = this.basicInfoModel.titleDesc;
        this.memName = this.basicInfoModel.firstName + ' ' + this.basicInfoModel.lastName;
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    this.showErrMsg = false;
  }
  async onUpload() {
    //do validation first
    if (this.selectedFile == null) {
      this.showErrMsg = true;
      this.errorMsg = 'Upload file is required. Please choose a file!';
      return;
    }

    if (
      this.selectedFile.type === 'image/jpeg' ||
      this.selectedFile.type === 'image/png' ||
      this.selectedFile.type === 'image/jpg' ||
      this.selectedFile.type === 'image/svg' ||
      this.selectedFile.type === 'image/gif'
    ) {
      if (this.selectedFile.size > 3000000) {
        // checking size here - 2MB}
        this.showErrMsg = true;
        this.errorMsg =
          'The chosen image file size is too big! Only file size of 3 megabytes or less allowed.';
        return;
      }
    } else {
      this.showErrMsg = true;
      this.errorMsg = 'Only image file types .jpg, .png, .svg, and .gif are allowed!';
      return;
    }

    //upload next
    this.isSaving = true;
    this.setSvc.UploadProfilePhoto(this.memberID.toString(), this.selectedFile).subscribe({});
    let f = this.memberID + '.' + this.selectedFile.name.split('.').pop();
    this.session.setSessionVar('userImage', f);
    this.isSaving = false;
    location.reload();
  }
}
