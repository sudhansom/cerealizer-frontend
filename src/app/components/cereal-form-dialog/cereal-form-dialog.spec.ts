import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerealFormDialog } from './cereal-form-dialog';

describe('CerealFormDialog', () => {
  let component: CerealFormDialog;
  let fixture: ComponentFixture<CerealFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerealFormDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CerealFormDialog);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('mode', 'add');
    fixture.componentRef.setInput('initial', null);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
