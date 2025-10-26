import { Component, OnInit } from '@angular/core';
import {
  MemberProfileBasicInfo,
  SportsList,
} from '../../../../core/models/members/profile-member.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../../../core/services/data/members.service';
import { CommonService } from '../../../../core/services/general/common.service';
import { SessionMgtService } from '../../../../core/services/general/session-mgt.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  public isSuccess = false;
  public sector = '';
  public isAthlete = false;
  public years: any;

  sportsList = new Array<SportsList>();

  basicInfoModel: MemberProfileBasicInfo = {
    picturePath: '',
    memProfileName: '',
    titleDesc: '',
    memProfileStatus: '',
    memProfileGender: '',
    memProfileDOB: '',
    interestedDesc: '',
    memProfileLookingFor: '',
    currentCity: '',
    currentStatus: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    firstName: '',
    homeNeighborhood: '',
    hometown: '',
    interestedInType: '',
    joinedDate: '',
    lastName: '',
    lookingForEmployment: false,
    lookingForNetworking: false,
    lookingForPartnership: false,
    lookingForRecruitment: false,
    memberID: '',
    middleName: '',
    politicalView: '',
    religiousView: '',
    sex: '',
    showDOBType: '',
    showSexInProfile: '',
    getLGEntitiesCount: '',
    sport: '',
    leftRightHandFoot: '',
    bio: '',
    height: '',
    weight: '',
    preferredPosition: '',
    secondaryPosition: '',
  };

  public constructor(
    public session: SessionMgtService,
    private route: ActivatedRoute,
    private router: Router,
    private membersSvc: MembersService,
    private comSvc: CommonService
  ) {}

  memberID!: string;

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getBasicInfo(this.memberID);
    this.getSportsList();
    this.getBirthDayYears();
  }

  getBasicInfo(memberId: string) {
    this.membersSvc.getMemberBasicInfo(memberId).subscribe({
      next: (info) => {
        this.basicInfoModel = info;
        if (
          this.basicInfoModel.currentStatus != 'Athlete (Amateur)' &&
          this.basicInfoModel.currentStatus != 'Athlete (Professional)'
        ) {
          this.isAthlete = false;
        } else {
          this.isAthlete = true;
        }
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
      },
    });
  }

  getSportsList() {
    this.comSvc.getSportsList().subscribe({
      next: (data) => {
        this.sportsList = data;
      },
      error: (err) => {
        console.error('Failed to load sports list', err);
      },
    });
  }

  saveBasicInfo() {
    this.isSuccess = false;
    this.isSaving = true;
    if (
      this.basicInfoModel.currentStatus != 'Athlete (Amateur)' &&
      this.basicInfoModel.currentStatus != 'Athlete (Professional)'
    ) {
      this.basicInfoModel.leftRightHandFoot = '';
      this.basicInfoModel.preferredPosition = '';
      this.basicInfoModel.secondaryPosition = '';
      this.basicInfoModel.height = '';
      this.basicInfoModel.weight = '';
    }
    if (this.basicInfoModel.middleName == null) this.basicInfoModel.middleName = '';

    this.membersSvc.SaveMemberGeneralInfo(this.memberID, this.basicInfoModel).subscribe();
    this.isSaving = false;
    this.isSuccess = true;
  }

  showAthleteAttributes(val: string) {
    if (val != 'Athlete (Amateur)' && val != 'Athlete (Professional)') this.isAthlete = false;
    else this.isAthlete = true;
  }

  public getBirthDayYears() {
    let baseYear = 2040;
    let y = [];

    for (let i = baseYear; i >= 1900; i--) {
      y.push(i);
    }
    this.years = Array.from(new Set(y));
  }
}
