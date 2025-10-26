import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MembersService } from '../../../../core/services/data/members.service';
import { MemberProfileBasicInfo } from '../../../../core/models/members/profile-member.model';
import { SessionMgtService } from '../../../../core/services/general/session-mgt.service';
import { environment } from '../../../../../environments/environment';
import { SchoolsByState } from '../../../../core/models/organization/schools-by-state.model';
import { CommonService } from '../../../../core/services/general/common.service';
import { States } from '../../../../core/models/states.model';
import { MemberProfileEducation } from '../../../../core/models/members/profile-education.model';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { UserInfoComponent } from '../../../members/edit-profile/user-info/user-info.component';
import { ContactInfoComponent } from '../../../members/edit-profile/contact-info/contact-info.component';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [FormsModule, MatTabsModule, CommonModule, UserInfoComponent, ContactInfoComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.css',
})
export class UpdateProfileComponent {
  @ViewChild('closeEditButton') closeEditButton: any;
  showEditModalBox: boolean = false;

  @ViewChild('ddlSchoolType') ddlSchoolType: any;
  @ViewChild('ddlST') ddlState: any;
  @ViewChild('ddlSC') ddlSchool: any;
  @ViewChild('ddlDG') ddlDegree: any;
  @ViewChild('ddlYR') ddlYear: any;
  @ViewChild('ddlCL') ddlCompLevel: any;

  @ViewChild('closeAddButton') closeAddButton: any;
  showAddModalBox: boolean = false;

  @ViewChild('closeRemoveButton') closeRemoveButton: any;
  showRemoveModalBox: boolean = false;

  public show: boolean = false;
  public showErrMsg: boolean = false;
  public noSchools: boolean = false;
  public years: any;

  public states!: States[];
  schoolsList!: SchoolsByState[];
  schoolName!: string;
  schoolID!: string;
  schoolType!: string;

  eduInfoEdit: MemberProfileEducation = {
    schoolID: '',
    schoolImage: '',
    Societies: '',
    schoolAddress: 'select',
    schoolName: '',
    schoolType: '3',
    webSite: '',
    major: '',
    degree: 'select',
    yearClass: 'select',
    degreeTypeID: '',
    sportLevelType: '',
  };

  eduInfo: MemberProfileEducation = {
    schoolID: '',
    schoolImage: '',
    Societies: '',
    schoolAddress: 'select',
    schoolName: '',
    schoolType: '3',
    webSite: '',
    major: '',
    degree: 'select',
    yearClass: 'select',
    degreeTypeID: '',
    sportLevelType: '',
  };

  //basic info variables
  memberID!: string;
  memImage!: string;
  memName!: string;
  memTitle!: string;
  adId!: string;

  basicInfoModel: MemberProfileBasicInfo = new MemberProfileBasicInfo();
  public isSaving = false;
  public isSuccess = false;
  public isSuccessVidSave = false;
  public channelID!: string;
  public instagramURL!: string;
  defaultTab!: number;
  mySubscription: any;

  constructor(
    private router: Router,
    public session: SessionMgtService,
    private route: ActivatedRoute,
    public membersSvc: MembersService,
    private comSvc: CommonService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  educationInfoModel!: MemberProfileEducation[];

  ngOnInit(): void {
    this.memberID = this.session.getSessionVal('userID');
    this.adId = this.route.snapshot.queryParamMap.get('adId')!;
    if (this.adId == '2') this.defaultTab = 3;
    else this.defaultTab = 0;
    this.getBasicInfo();
    this.getChannelID();
    this.getInstagramURL();

    this.memberID = this.session.getSessionVal('userID');
    this.getEducationYears();
    this.getEducationInfo();
    this.getStates();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  getBasicInfo() {
    this.membersSvc.getMemberBasicInfo(this.memberID).subscribe({
      next: (info) => {
        this.basicInfoModel = info;
        if (this.basicInfoModel.picturePath.length == 0) {
          this.memImage = environment.memberImagesUrlPath + 'default.png';
        } else {
          this.memImage = environment.memberImagesUrlPath + this.basicInfoModel.picturePath;
        }
        this.memTitle = this.basicInfoModel.titleDesc;
        this.memName = this.basicInfoModel.firstName + ' ' + this.basicInfoModel.lastName;
      },
      error: (err) => {
        console.error('Failed to fetch member basic info:', err);
      },
    });
  }

  getChannelID() {
    this.membersSvc.getChannelId(this.memberID).subscribe({
      next: (response) => {
        // Parse the string into an object
        const data = JSON.parse(response);
        this.channelID = data.channelID;
      },
      error: (err) => {
        console.error('Failed to get channel ID', err);
      },
    });
  }

  getInstagramURL() {
    this.membersSvc.getInstagramURL(this.memberID).subscribe({
      next: (response) => {
        // Parse the string into an object
        const data = JSON.parse(response);
        this.instagramURL = data.url;
      },
      error: (err) => {
        console.error('Failed to get instagram url', err);
      },
    });
  }

  saveChannelID() {
    this.isSuccessVidSave = false;
    this.isSaving = true;
    this.membersSvc.saveChannelID(this.memberID, this.channelID).subscribe();
    this.isSaving = false;
    this.isSuccessVidSave = true;
  }

  saveInstagramURL() {
    this.isSuccess = false;
    this.isSaving = true;
    this.membersSvc.saveInstagramURL(this.memberID, this.instagramURL).subscribe();
    this.isSaving = false;
    this.isSuccess = true;
  }

  getEducationInfo() {
    this.membersSvc.getMemberEducationInfo(this.memberID).subscribe({
      next: (educationInfo) => {
        this.educationInfoModel = educationInfo;
        if (this.educationInfoModel.length == 0) {
          this.noSchools = true;
        } else {
          this.noSchools = false;
        }
      },
      error: (err) => {
        console.error('Failed to load edu info.', err);
      },
    });
  }

  getStates() {
    this.comSvc.getStates().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (err) => {
        console.error('Error fetching states:', err);
      },
    });
  }

  jumpToEditSchool(
    id: string,
    name: string,
    major: string,
    degree: string,
    classYear: string,
    sportLevelType: string,
    schoolType: string
  ) {
    this.schoolName = name;
    this.eduInfoEdit.degree = degree;
    this.eduInfoEdit.major = major;
    this.eduInfoEdit.yearClass = classYear;
    this.eduInfoEdit.schoolID = id;
    this.eduInfoEdit.sportLevelType = sportLevelType;
    this.eduInfoEdit.schoolType = schoolType;
    this.getEducationYears();

    const modEl = document.getElementById('editModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();

    return false;
  }

  jumpToRemoveSchool(id: string, type: string, name: string) {
    this.schoolName = name;
    this.schoolID = id;
    this.schoolType = type;
    this.showRemoveModalBox = true;

    const modEl = document.getElementById('removeModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();

    return false;
  }

  onStateChange(ev: any) {
    let state = (ev.target as HTMLInputElement).value;
    this.comSvc.getSchoolsByState(state, this.eduInfo.schoolType).subscribe({
      next: (schools) => {
        this.schoolsList = schools;
      },
      error: (err) => {
        console.error('Error fetching schools:', err);
      },
    });
  }

  doAddNewSchool(form: any) {
    this.isSaving = true;
    this.membersSvc.AddNewSchool(this.memberID, this.eduInfo).subscribe({
      next: () => {
        this.getEducationInfo();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error adding school:', err);
      },
    });

    //do reset controls
    this.ddlSchoolType.nativeElement.selectedIndex = 0;
    this.ddlState.nativeElement.selectedIndex = 0;
    this.ddlSchool.nativeElement.selectedIndex = 0;
    this.eduInfo.major = '';
    this.ddlDegree.nativeElement.selectedIndex = 0;
    this.ddlYear.nativeElement.selectedIndex = 0;
    this.ddlCompLevel.nativeElement.selectedIndex = 0;
    this.closeAddButton.nativeElement.click();
  }

  doUpdateSchool() {
    this.isSaving = true;
    this.membersSvc.UpdateSchool(this.memberID, this.eduInfoEdit).subscribe({
      next: () => {
        this.getEducationInfo();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating school:', err);
      },
    });
    this.closeEditButton.nativeElement.click();
  }

  doRemoveSchool() {
    this.isSaving = true;
    this.membersSvc.RemoveSchool(this.memberID, this.schoolID, this.schoolType).subscribe({
      next: () => {
        this.getEducationInfo();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error updating school:', err);
      },
    });
    this.closeRemoveButton.nativeElement.click();
  }

  goToLink(url: string) {
    window.open(url + '/', '_blank');
    return false;
  }

  public getEducationYears() {
    let baseYear = 2040;
    let y = [];
    for (let i = baseYear; i >= 1900; i--) {
      y.push(i);
    }
    this.years = Array.from(new Set(y));
  }
}
