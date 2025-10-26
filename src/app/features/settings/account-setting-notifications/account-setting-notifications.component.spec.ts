import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingNotificationsComponent } from './account-setting-notifications.component';

describe('AccountSettingNotificationsComponent', () => {
  let component: AccountSettingNotificationsComponent;
  let fixture: ComponentFixture<AccountSettingNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
