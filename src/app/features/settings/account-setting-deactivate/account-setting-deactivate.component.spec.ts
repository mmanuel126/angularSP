import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingDeactivateComponent } from './account-setting-deactivate.component';

describe('AccountSettingDeactivateComponent', () => {
  let component: AccountSettingDeactivateComponent;
  let fixture: ComponentFixture<AccountSettingDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingDeactivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
