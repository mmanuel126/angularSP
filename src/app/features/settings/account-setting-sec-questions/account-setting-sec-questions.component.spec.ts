import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingSecQuestionsComponent } from './account-setting-sec-questions.component';

describe('AccountSettingSecQuestionsComponent', () => {
  let component: AccountSettingSecQuestionsComponent;
  let fixture: ComponentFixture<AccountSettingSecQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSettingSecQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingSecQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
