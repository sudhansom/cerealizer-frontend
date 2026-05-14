import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerealSearch } from './cereal-search';

describe('CerealSearch', () => {
  let component: CerealSearch;
  let fixture: ComponentFixture<CerealSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerealSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(CerealSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
