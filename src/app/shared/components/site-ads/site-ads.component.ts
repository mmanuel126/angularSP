import { Component } from '@angular/core';
import { AdsService } from '../../../core/services/general/ads.service';
import { AdsModel } from '../../../core/models/ads.model';
import { SessionMgtService } from '../../../core/services/general/session-mgt.service';
import { environment } from '../../../../environments/environment';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-site-ads',
  standalone: true,
  imports: [CarouselModule, RouterModule, CommonModule],
  providers: [AdsService],
  templateUrl: './site-ads.component.html',
  styleUrl: './site-ads.component.css',
})
export class SiteAdsComponent {
  public webSiteDomain = environment.webSiteDomain;
  userId: string;
  constructor(public adsSvc: AdsService, public session: SessionMgtService) {
    this.userId = this.session.getSessionVal('userID');
  }
  adsList!: AdsModel[];

  ngOnInit() {
    this.getAds('SiteGuide');
  }

  getAds(type: string) {
    this.adsSvc.getAds(type).subscribe({
      next: (ads) => {
        this.adsList = ads;
      },
      error: (err) => {
        console.error('Error fetching ads:', err);
      },
    });
  }
}
