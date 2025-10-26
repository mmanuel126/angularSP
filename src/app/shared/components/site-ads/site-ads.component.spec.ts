import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAdsComponent } from './site-ads.component';

describe('SiteAdsComponent', () => {
  let component: SiteAdsComponent;
  let fixture: ComponentFixture<SiteAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteAdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
