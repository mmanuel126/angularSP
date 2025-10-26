import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySettingProfileComponent } from './privacy-setting-profile.component';

describe('PrivacySettingProfileComponent', () => {
  let component: PrivacySettingProfileComponent;
  let fixture: ComponentFixture<PrivacySettingProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacySettingProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacySettingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
