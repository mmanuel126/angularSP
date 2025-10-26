import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/general/auth.service';
import { Login } from '../../../core/models/login.model';
import { environment } from '../../../../environments/environment';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { FormsModule } from '@angular/forms';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-reactivate',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './reactivate.component.html',
  styleUrl: './reactivate.component.css',
})
export class ReactivateComponent {
  public webSiteDomain = environment.webSiteDomain;
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  result: string = '';
  public isLoading = false;
  userID: string = '';

  login: Login = {
    email: '',
    password: '',
  };

  public show: boolean = false;

  constructor(
    public authSvc: AuthService,
    public session: SessionMgtService,
    private router: Router /*public msgSvc: MessagesService*/
  ) {}

  formData: FormData = {
    email: '',
  };

  ngOnInit() {
    if (this.session.getSessionVal('isUserLogin') == 'true') {
      this.router.navigate(['/home']);
    }
  }

  reactivateUser() {
    this.isLoading = true;

    this.authSvc.login(this.login).subscribe({
      next: (response: UserModel) => {
        this.isLoading = false;
        // handle successful login
        if (response.memberID != '') {
          if (response.currentStatus == '3') {
            //deactivated. -- reset active flag to activated
            this.authSvc.setMemberStatus(response.memberID, '2').subscribe();
          }

          if (response.currentStatus == '2' || response.currentStatus == '3') {
            //active. - or just got activated
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
            this.router.navigate(['/home']);
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

export class FormData {
  email: string = '';
}
