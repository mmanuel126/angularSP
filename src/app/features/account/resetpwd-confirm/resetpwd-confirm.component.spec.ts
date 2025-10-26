import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpwdConfirmComponent } from './resetpwd-confirm.component';

describe('ResetpwdConfirmComponent', () => {
  let component: ResetpwdConfirmComponent;
  let fixture: ComponentFixture<ResetpwdConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetpwdConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetpwdConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
