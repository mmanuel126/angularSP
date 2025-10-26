import { Component } from '@angular/core';
import { Register } from '../../../core/models/register.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/general/auth.service';
import { CommonService } from '../../../core/services/general/common.service';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  public years: any[] = [];

  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  public show: boolean = false;
  public terms: boolean = false;

  public showErrMsg: boolean = false;

  genders = ['Female', 'Male'];
  profileTypes = [
    'Agent',
    'Athlete (Amateur)',
    'Athlete (Professional)',
    'Athletic Trainer',
    'Coach',
    'Management',
    'Referee',
    'Retired',
    'Scout',
    'Sports Fanatic',
  ];

  register: Register = {
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

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private commonSvc: CommonService
  ) {}

  scroll = (event: Event): void => {};
  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
    this.getYears();
  }

  getYears() {
    this.commonSvc.getYears(2030, 1900).subscribe({
      next: (response: any[]) => {
        this.years = response;
      },
    });
  }

  registerUser() {
    this.show = true;
    this.showErrMsg = false;

    this.authSvc.register(this.register).subscribe({
      next: (response: string) => {
        if (response == 'ExistingEmail') {
          this.showErrMsg = true;
        } else if (response == 'NewEmail') {
          this.router.navigate(['/confirm-register'], {
            queryParams: { email: this.register.email },
          });
        }
        this.show = false;
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.show = false;
      },
    });
  }
}
