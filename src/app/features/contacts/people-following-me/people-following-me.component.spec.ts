import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleFollowingMeComponent } from './people-following-me.component';

describe('PeopleFollowingMeComponent', () => {
  let component: PeopleFollowingMeComponent;
  let fixture: ComponentFixture<PeopleFollowingMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeopleFollowingMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleFollowingMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
