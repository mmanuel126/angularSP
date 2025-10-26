import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-footer',
  standalone: true,
  templateUrl: './login-footer.component.html',
  styleUrl: './login-footer.component.css',
})
export class LoginFooterComponent {
  public currentYear = new Date().getFullYear().toString();
  public appLogoText = environment.appLogoText;
  public companyName = environment.companyName;

  constructor() {
    /* no constructor params */
  }
  ngOnInit() {
    /* no inits */
  }
}
