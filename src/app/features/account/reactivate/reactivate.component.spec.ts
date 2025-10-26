import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateComponent } from './reactivate.component';

describe('ReactivateComponent', () => {
  let component: ReactivateComponent;
  let fixture: ComponentFixture<ReactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
