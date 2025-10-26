import { filter } from 'rxjs/operators';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/general/auth.service';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resetpwd',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './resetpwd.component.html',
  styleUrl: './resetpwd.component.css',
})
export class ResetpwdComponent {
  public appLogoText = environment.appLogoText;
  public isWorking: boolean = false;
  email: string = '';
  public showErrMsg: boolean = false;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authSrvc: AuthService
  ) {}

  user: UserDataModel = {
    code: '',
  };

  ngOnInit() {
    this.route.queryParams.pipe(filter((params) => params['email'])).subscribe((params) => {
      this.email = params['email'];
    });

    this.route.queryParams.pipe(filter((params) => params['code'])).subscribe((params) => {
      this.user.code = params['code'];
    });
  }

  resetPasswordUser() {
    this.showErrMsg = false;
    this.isWorking = true;
    const email = this.email;
    const code = this.user.code;
    this.authSrvc.isResetCodeExpired(code).subscribe({
      next: (response) => {
        if (response === 'true') {
          this.showErrMsg = true;
          this.isWorking = false;
        } else {
          this.router.navigate(['/changepwd'], { queryParams: { email: email, code: code } });
        }
      },
      error: (err) => {
        console.error('Error checking reset code:', err);
      },
    });
  }
}

export class UserDataModel {
  code: string = '';
}
