import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/general/auth.service';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-complete-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './complete-register.component.html',
  styleUrl: './complete-register.component.css',
})
export class CompleteRegisterComponent {
  public show: boolean = false;
  public terms: boolean = false;

  public appLogoText = environment.appLogoText;
  public appName = environment.appName;
  public companyName = environment.companyName;

  result: string = '';
  public isLoading = false;
  userID: string = '';

  public constructor(
    public authSvc: AuthService,
    public session: SessionMgtService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.session.getSessionVal('isUserLogin') == 'true') {
      this.router.navigate(['/home']);
    }
  }

  onCheckboxChange(e: Event): void {
    const checkbox = e.target as HTMLInputElement;
    this.terms = checkbox.checked;
  }

  completeRegister() {
    this.isLoading = true;
    let code = '';
    let email = '';
    this.route.queryParams.pipe(filter((params) => params['code'])).subscribe((params) => {
      code = params['code'];
    });
    this.route.queryParams.pipe(filter((params) => params['email'])).subscribe((params) => {
      email = params['email'];
    });

    this.authSvc.validateNewRegisteredUser(email, code).subscribe({
      next: (response: UserModel) => {
        this.isLoading = false;
        if (response.memberID != null) {
          //change status from newly registered user to existing user
          this.authSvc.setMemberStatus(response.memberID, '2').subscribe();
          this.session.setSessionVar('isUserLogin', 'true');
          this.session.setSessionVar('userID', response.memberID);
          this.userID = response.memberID;
          this.session.setSessionVar('userEmail', response.email);
          this.session.setSessionVar('userTitle', response.title);
          this.session.setSessionVar('userName', response.name);
          localStorage.setItem('access_token', response.accessToken);
          if (response.picturePath != '') {
            this.session.setSessionVar('userImage', response.picturePath);
          } else {
            this.session.setSessionVar('userImage', 'default.png');
          }
          this.session.setSessionVar('pwd', code);
          this.result = 'found';
          this.router.navigate(['/home']);
        } else {
          this.session.setSessionVar('isUserLogin', 'false');
          this.result = 'notfound';
        }
      },
      error: (error) => {
        this.session.setSessionVar('isUserLogin', 'false');
        this.result = 'notfound';
      },
    });
  }
}
