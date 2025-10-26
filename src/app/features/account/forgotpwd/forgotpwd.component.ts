import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/general/auth.service';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgotpwd',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './forgotpwd.component.html',
  styleUrl: './forgotpwd.component.css',
})
export class ForgotpwdComponent {
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;
  public show: boolean = false;

  constructor(private router: Router, private authSvrc: AuthService) {}

  formData: FormData = {
    email: '',
  };

  ngOnInit() {
    // TO DO document why this method 'ngOnInit' is empty
  }

  forgotPassword() {
    let e = this.formData.email;
    this.show = true;
    this.authSvrc.resetPassword(e).subscribe({
      next: (response: string) => {
        this.router.navigate(['/resetpwd'], { queryParams: { email: e } });
      },
      error: (error) => {
        console.error('Password reset failed:', error);
      },
    });
  }
}

export class FormData {
  email: string = '';
}
