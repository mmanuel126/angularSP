import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingNameComponent } from './account-setting-name.component';

describe('AccountSettingNameComponent', () => {
  let component: AccountSettingNameComponent;
  let fixture: ComponentFixture<AccountSettingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
