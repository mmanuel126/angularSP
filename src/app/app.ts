import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

// Import any standalone components used
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SiteAdsComponent } from './shared/components/site-ads/site-ads.component';
import { SuggestionsComponent } from './shared/components/suggestions/suggestions.component';
import { LoginFooterComponent } from './shared/components/login-footer/login-footer.component';
import { SessionMgtService } from './core/services/general/session-mgt.service';
import { AppService } from './core/services/general/app.service';
import { NologinFooterComponent } from './shared/components/nologin-footer/nologin-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SiteAdsComponent,
    SuggestionsComponent,
    LoginFooterComponent,
    NologinFooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public isUserLogin: boolean = false;
  public isShowingProfile: boolean = false;
  title = environment.appName;
  public onlineOffline: boolean = navigator.onLine;

  constructor(
    public session: SessionMgtService,
    private appService: AppService,
    private route: Router,
    private titleService: Title
  ) {
    titleService.setTitle(this.title);
    this.isUserLogin = this.session.getSessionVal('isUserLogin');
  }

  getClasses() {
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled,
    };
    return classes;
  }

  toggleSidebar() {
    this.appService.toggleSidebar();
  }
}
