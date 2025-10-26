import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleIFollowComponent } from './people-i-follow.component';

describe('PeopleIFollowComponent', () => {
  let component: PeopleIFollowComponent;
  let fixture: ComponentFixture<PeopleIFollowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleIFollowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleIFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
