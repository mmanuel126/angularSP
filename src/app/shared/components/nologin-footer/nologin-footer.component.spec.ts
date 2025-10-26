import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NologinFooterComponent } from './nologin-footer.component';

describe('NologinFooterComponent', () => {
  let component: NologinFooterComponent;
  let fixture: ComponentFixture<NologinFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NologinFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NologinFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
