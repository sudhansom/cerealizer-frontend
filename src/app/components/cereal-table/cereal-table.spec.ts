import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerealTable } from './cereal-table';

describe('CerealTable', () => {
  let component: CerealTable;
  let fixture: ComponentFixture<CerealTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerealTable],
    }).compileComponents();

    fixture = TestBed.createComponent(CerealTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cereals', []);
    fixture.componentRef.setInput('isLoggedIn', false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
