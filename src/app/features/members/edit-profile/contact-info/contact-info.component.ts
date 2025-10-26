import { Component, OnInit } from '@angular/core';
import { MemberProfileContactInfo } from '../../../../core/models/members/profile-contact-info.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../../../core/services/data/members.service';
import { SessionMgtService } from '../../../../core/services/general/session-mgt.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.css',
})
export class ContactInfoComponent implements OnInit {
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public isSaving = false;
  public isSuccess = false;

  memberID!: string;
  contactInfoModel: MemberProfileContactInfo = new MemberProfileContactInfo();

  public constructor(
    public session: SessionMgtService,
    private route: ActivatedRoute,
    private router: Router,
    private membersSvc: MembersService
  ) {}

  ngOnInit() {
    this.memberID = this.session.getSessionVal('userID');
    this.getContactInfo(this.memberID);
  }

  getContactInfo(memberId: string) {
    this.membersSvc.getMemberContactInfo(memberId).subscribe({
      next: (contactInfo) => {
        this.contactInfoModel = contactInfo;
      },
      error: (err) => {
        console.error('Error fetching member contact info:', err);
      },
    });
  }

  saveContactInfo() {
    this.isSuccess = false;
    this.isSaving = true;
    this.membersSvc.SaveMemberContactInfo(this.memberID, this.contactInfoModel).subscribe();
    this.isSaving = false;
    this.isSuccess = true;
  }
}
