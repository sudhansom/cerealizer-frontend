import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCereals } from './display-cereals';

describe('DisplayCereals', () => {
  let component: DisplayCereals;
  let fixture: ComponentFixture<DisplayCereals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayCereals],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayCereals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
