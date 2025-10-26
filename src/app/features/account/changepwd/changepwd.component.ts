import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Register } from '../../../core/models/register.model';
import { AuthService } from '../../../core/services/general/auth.service';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-changepwd',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './changepwd.component.html',
  styleUrl: './changepwd.component.css',
})
export class ChangepwdComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSvc: AuthService,
    public session: SessionMgtService
  ) {}

  email: string = '';
  code: string = '';
  public currentYear = new Date().getFullYear().toString();
  public show: boolean = false;
  public showErrMsg: boolean = false;
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  user: Register = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPwd: '',
    gender: 'select',
    month: 'Month',
    day: 'Day',
    year: 'Year',
    code: '',
    profileType: 'select',
  };

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.code = params['code'];
    });
  }

  async changePassword() {
    this.show = true;
    this.user.email = this.email;
    this.user.code = this.code;
    this.authSvc.changePassword(this.user).subscribe({
      next: (response) => {
        if (response != '') {
          this.router.navigate(['/resetpwd-confirm']);
        } else {
          this.showErrMsg = true;
        }
        this.show = false;
      },
      error: (err) => {
        console.error('Error changing password:', err);
        this.show = false;
      },
    });
  }
}
