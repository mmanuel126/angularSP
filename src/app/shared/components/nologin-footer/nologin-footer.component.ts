import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-nologin-footer',
  standalone: true,
  imports: [],
  templateUrl: './nologin-footer.component.html',
  styleUrl: './nologin-footer.component.css',
})
export class NologinFooterComponent {
  public webSiteDomain = environment.webSiteDomain;
  public currentYear = new Date().getFullYear().toString();
  public companyName = environment.companyName;
  public appLogoText = environment.appLogoText;

  aboutPopupText = `
  <p><strong>SP</strong> is a social networking site for athletes, sport agents, and sports fans.</p>
  <p>You can create an account, set up your profile, and connect with others to showcase your skills.</p>
  <p>If you're an athlete, you can find agents. If you're an agent, you can recruit athletes.</p>
`;

  constructor() {}

  openDialog() {
    return false;
  }
}
