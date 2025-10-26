import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacySettingSearchComponent } from './privacy-setting-search.component';

describe('PrivacySettingSearchComponent', () => {
  let component: PrivacySettingSearchComponent;
  let fixture: ComponentFixture<PrivacySettingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrivacySettingSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacySettingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
