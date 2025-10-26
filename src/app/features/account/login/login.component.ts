import { OsDetectionService } from '../../../core/services/general/os-detection.service';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Login } from '../../../core/models/login.model';
import { AuthService } from '../../../core/services/general/auth.service';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public appLogoText = environment.appLogoText;
  result: string = '';
  public isLoading = false;
  userID: string = '';

  login: Login = {
    email: '',
    password: '',
  };

  public loginValid = true;
  public username = '';
  public password = '';

  isDisabled: boolean = false;
  public operatingSystem: string = '';

  private readonly returnUrl: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private osDetectionService: OsDetectionService,
    public authSvc: AuthService,
    public session: SessionMgtService
  ) {
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/game';
  }

  ngOnInit() {
    this.operatingSystem = this.osDetectionService.getOperatingSystem();
    console.log('Operating System:', this.operatingSystem);
  }

  async loginUser() {
    this.isLoading = true;

    this.authSvc.login(this.login).subscribe({
      next: (response: UserModel) => {
        this.isLoading = false;
        // handle successful login
        if (response.memberID != '') {
          if (response.currentStatus == '2') {
            //active
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
            this.session.setSessionVar('pwd', this.login.password);
            this.result = 'found';
            this._router.navigate(['/home']);
          } else if (response.currentStatus == '3') {
            //deactivated
            this.result = 'deactivated';
            this.isLoading = false;
          }
        } else {
          this.session.setSessionVar('isUserLogin', 'false');
          this.result = 'notfound';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.session.setSessionVar('isUserLogin', 'false');
        this.result = 'notfound';
        this.isLoading = false;
      },
    });
  }
}
