import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingChangePhotoComponent } from './account-setting-change-photo.component';

describe('AccountSettingChangePhotoComponent', () => {
  let component: AccountSettingChangePhotoComponent;
  let fixture: ComponentFixture<AccountSettingChangePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingChangePhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingChangePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
