import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MembersService } from '../../../../core/services/data/members.service';
import { ContactsService } from '../../../../core/services/data/contacts.service';
import { SessionMgtService } from '../../../../core/services/general/session-mgt.service';
import { MemberProfileEducation } from '../../../../core/models/members/profile-education.model';
import { MemberProfileContactInfo } from '../../../../core/models/members/profile-contact-info.model';
import { Contact } from '../../../../core/models/contacts/contact-model';
import { CommonService } from '../../../../core/services/general/common.service';
import { environment } from '../../../../../environments/environment';
import {
  MemberProfileBasicInfo,
  YoutubePlayList,
  YoutubeVideosList,
} from '../../../../core/models/members/profile-member.model';
import { SettingsService } from '../../../../core/services/data/settings.service';
import { subscribeOn } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-show-profile',
  standalone: true,
  imports: [MatTabsModule, FormsModule, CommonModule],
  providers: [SettingsService],
  templateUrl: './show-profile.component.html',
  styleUrl: './show-profile.component.css',
})
export class ShowProfileComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closeVideoButton') closeVideoButton: any;
  showVideoModalBox: boolean = false;

  code: string = '';
  spinner!: boolean;
  cStatus: string = '';

  //basic info variables
  memberID: string = '';
  memImage: string = '';
  memName: string = '';
  memTitle: string = '';
  sport: string = '';
  bio: string = '';
  height: string = '';
  weight: string = '';
  memGender: string = '';
  memBirthDate: string = '';
  memLookingFor: string = '';
  LeftRightHandFoot: string = '';
  PreferredPosition: string = '';
  SecondaryPosition: string = '';
  showDOB: string = '';
  showSex: string = '';

  showAddress: boolean = true;
  showCellPhone: boolean = true;
  showEmail: boolean = true;
  showHomePhone: boolean = true;
  showLinks: boolean = true;

  showBasicInfo: string = '1';
  showPersonalInfo: string = '1';
  showContacts: string = '1';
  showEducation: string = '1';
  showWorkInfo: string = '1';
  contactIsAFriend!: boolean;
  isSameUser!: boolean;

  memEmail: string = '';
  memOtherEmail: string = '';
  memIMname: string = '';
  memWebSite: string = '';
  memCellPhone: string = '';
  memOtherPhone: string = '';
  memAddress: string = '';
  memCity: string = '';
  memNeighborhood: string = '';
  memState: string = '';
  memZip: string = '';

  about: string = '';
  interests: string = '';
  activities: string = '';
  specialSkills: string = '';

  basicInfoModel: MemberProfileBasicInfo = new MemberProfileBasicInfo();
  contactInfoModel: MemberProfileContactInfo = new MemberProfileContactInfo();
  educationInfoModel!: MemberProfileEducation[];

  myContactsList!: Contact[];
  playList!: YoutubePlayList[];

  videosList!: YoutubeVideosList[];

  eduCount!: number;
  empCount!: number;
  contactCount!: number;
  networkCount!: number;
  eventCount!: number;
  vidCount!: number;
  videoId!: string;

  contactName!: string;

  showAddAsContact: boolean = false;
  showFollowMember: boolean = false;

  public activeId!: string;
  mySubscription: any;

  constructor(
    public session: SessionMgtService,
    private route: ActivatedRoute,
    private router: Router,
    public membersSvc: MembersService,
    public contactsSvc: ContactsService,
    public common: CommonService,
    public settingsSvc: SettingsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit(): void {
    this.memberID = this.route.snapshot.queryParamMap.get('memberID') ?? '';
    console.log(this.memberID);
    this.code = this.route.snapshot.queryParamMap.get('code') ?? '';
    this.getPrivacySettings();
    this.checkIfMemberIsAFriend(this.memberID);
    this.checkIfSameUser(this.memberID);
    this.getBasicInfo();
    this.getContactInfo();
    this.checkIfToShowAsContact(this.memberID);
    this.checkIfToShowFollowMember(this.memberID);
    this.getEducationInfo();
    this.getVideoPlayList();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  checkIfToShowAsContact(memberID: string) {
    let loggedUserID = this.session.getSessionVal('userID');
    let friend = '';
    this.membersSvc.IsFriendByContactID(loggedUserID, memberID).subscribe({
      next: (isFriend: string) => {
        friend = isFriend;
      },
      error: (err) => {
        console.error('Error checking to see if member is friends to contact.', err);
      },
    });

    if (loggedUserID != memberID && friend != 'true') {
      this.showAddAsContact = true;
    }
  }

  checkIfToShowFollowMember(memberID: string) {
    let loggedUserID = this.session.getSessionVal('userID');
    let following = '';
    this.contactsSvc.isFollowingContact(loggedUserID, memberID).subscribe({
      next: (isFollowing: string) => {
        following = isFollowing;
      },
      error: (err) => {
        console.error('Error checking if is following contact.', err);
      },
    });

    if (loggedUserID != memberID && following != 'true') {
      this.showFollowMember = true;
    }
  }

  onTabChange($event: any) {
    let tab = $event.nextId;
    if (tab == 'basicInfo') this.getBasicInfo();
    else if (tab == 'contact') this.getContactInfo();
    else if (tab == 'education') this.getEducationInfo();
  }

  getVideoPlayList() {
    this.membersSvc.getVideoPlayList(this.memberID).subscribe({
      next: (playlist) => {
        this.playList = playlist;
      },
      error: (err) => {
        console.error('Failed to load playlist:', err);
      },
    });
  }

  onPlayListChange(id: any) {
    this.membersSvc.getVideosList(id).subscribe({
      next: (videos) => {
        this.videosList = videos;
        this.vidCount = videos.length;
      },
      error: (err) => {
        console.error('Error fetching videos:', err);
      },
    });
  }

  getBasicInfo() {
    this.membersSvc.getMemberBasicInfo(this.memberID).subscribe({
      next: (info) => {
        this.basicInfoModel = info;
        if (this.basicInfoModel.currentStatus != null)
          this.cStatus = this.basicInfoModel.currentStatus;
        if (this.basicInfoModel.bio.length != 0) this.bio = this.basicInfoModel.bio;
        if (this.basicInfoModel.picturePath.length == 0)
          this.memImage = environment.memberImagesUrlPath + 'default.png';
        else this.memImage = environment.memberImagesUrlPath + this.basicInfoModel.picturePath;
        this.memTitle = this.basicInfoModel.titleDesc;
        this.memName = this.basicInfoModel.firstName + ' ' + this.basicInfoModel.lastName;
        if (this.basicInfoModel.sport == null || this.basicInfoModel.sport.length == 0)
          this.sport = '';
        else this.sport = this.basicInfoModel.sport;
        let str = '';
        if (this.basicInfoModel.lookingForEmployment) str = 'Employment, ';
        if (this.basicInfoModel.lookingForNetworking) str = str + 'Networking, ';
        if (this.basicInfoModel.lookingForPartnership) str = str + 'Partnership, ';
        if (this.basicInfoModel.lookingForRecruitment) str = str + 'Recruitment, ';
        str = str.slice(0, -2);
        this.memLookingFor = str;
      },
      error: (err) => {
        console.error('Failed to fetch member info:', err);
      },
    });
  }

  async getContactInfo() {
    this.membersSvc.getMemberContactInfo(this.memberID).subscribe({
      next: (contactInfo) => {
        this.contactInfoModel = contactInfo;
        this.memOtherEmail = this.contactInfoModel.otherEmail;
        this.showEmail = this.contactInfoModel.showEmailToMembers;
      },
      error: (err) => {
        console.error('Error fetching member contact info:', err);
      },
    });
  }

  getEducationInfo() {
    this.membersSvc.getMemberEducationInfo(this.memberID).subscribe({
      next: (educationInfo) => {
        this.educationInfoModel = educationInfo;
        this.eduCount = this.educationInfoModel.length;
      },
      error: (err) => {
        console.error('Error fetching education info:', err);
      },
    });
  }

  async getMyContactsList() {
    this.contactsSvc.getMyContacts(this.memberID).subscribe({
      next: (contactList) => {
        this.myContactsList = contactList;
        this.contactCount = this.myContactsList.length;
      },
      error: (err) => {
        console.error('Error fetching contact list:', err);
      },
    });
  }

  addSearchContactPopup(name: any) {
    this.contactName = name;
    const modEl = document.getElementById('addModal');
    const modal = new bootstrap.Modal(modEl);
    modal.show();
    return false;
  }

  sendRequest() {
    this.sendTheRequest();
    this.closebutton.nativeElement.click();
    return false;
  }

  sendTheRequest() {
    let loggedUserID = this.session.getSessionVal('userID');
    let contactID = this.route.snapshot.queryParamMap.get('memberID');
    this.contactsSvc.addContact(loggedUserID, contactID!).subscribe();
    this.showAddAsContact = false;
  }

  getPrivacySettings() {
    this.settingsSvc.GetProfileSettings(this.memberID.toString()).subscribe({
      next: (data) => {
        if (data.length != 0) {
          this.showBasicInfo = data[0].basicInfo;
          this.showContacts = data[0].contactInfo;
          this.showPersonalInfo = data[0].personalInfo;
          this.showEducation = data[0].education;
          this.showWorkInfo = data[0].workInfo;
        }
      },
      error: (err) => {
        console.error('Error fetching contact list:', err);
      },
    });
  }

  doFollowMember() {
    let loggedUserID = this.session.getSessionVal('userID');
    this.contactsSvc.followContact(loggedUserID, this.memberID).subscribe();
    this.showFollowMember = false;
  }

  async checkIfMemberIsAFriend(memberID: string) {
    let loggedUserID = this.session.getSessionVal('userID');

    this.membersSvc.IsFriendByContactID(loggedUserID, memberID).subscribe({
      next: (data) => {
        if (data == 'true') {
          this.contactIsAFriend = true;
        } else {
          this.contactIsAFriend = false;
        }
      },
      error: (err) => {
        console.error('Error fetching contact list:', err);
      },
    });
  }

  checkIfSameUser(memberID: string) {
    let loggedUserID = this.session.getSessionVal('userID');
    if (loggedUserID == memberID) {
      this.isSameUser = true;
    } else {
      this.isSameUser = false;
    }
  }

  doShowProfile(memberId: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['members/view-profile/show-profile'], {
      queryParams: { memberID: memberId },
    });
    return false;
  }
}
