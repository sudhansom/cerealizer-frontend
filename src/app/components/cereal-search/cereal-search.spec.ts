import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ISearchInputs } from '../../models/cereal-types';
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

  describe('search emission', () => {
    /**
     * Helper: capture the next payload emitted by `search`. Returns the
     * collected emissions so individual tests can make assertions on order
     * and content.
     */
    function captureEmissions(): ISearchInputs[] {
      const emissions: ISearchInputs[] = [];
      component.search.subscribe((payload) => emissions.push(payload));
      return emissions;
    }

    it('converts numeric string input to a number on emit', () => {
      const emissions = captureEmissions();

      component.addCondition();
      component.onItemChange(0, 'Calories');
      component.onConditionChange(0, 'greaterThan');
      component.onValueChange(0, '120');
      component.emit();

      expect(emissions.length).toBe(1);
      expect(emissions[0].items).toEqual(['Calories']);
      expect(emissions[0].conditions).toEqual(['greaterThan']);
      expect(emissions[0].values).toEqual([120]);
      expect(typeof emissions[0].values[0]).toBe('number');
    });

    it('emits null for an empty numeric input instead of coercing to 0', () => {
      const emissions = captureEmissions();

      component.addCondition();
      component.onItemChange(0, 'Calories');
      component.onValueChange(0, '');
      component.emit();

      expect(emissions.length).toBe(1);
      expect(emissions[0].values).toEqual([null]);
    });

    it('keeps text-field values as strings (does not call Number)', () => {
      const emissions = captureEmissions();

      component.addCondition();
      component.onItemChange(0, 'Name');
      component.onConditionChange(0, 'equalTo');
      component.onValueChange(0, 'Cheerios');
      component.emit();

      expect(emissions[0].items).toEqual(['Name']);
      expect(emissions[0].values).toEqual(['Cheerios']);
      expect(typeof emissions[0].values[0]).toBe('string');
    });

    it('emits on removeCondition so the table re-queries without the dropped row', () => {
      const emissions = captureEmissions();

      component.addCondition();
      component.onItemChange(0, 'Calories');
      component.onValueChange(0, '50');
      component.addCondition();
      component.onItemChange(1, 'Protein');
      component.onValueChange(1, '3');
      component.removeCondition(0);

      // `removeCondition` calls `emit()` exactly once.
      expect(emissions.length).toBe(1);
      expect(emissions[0].items).toEqual(['Protein']);
      expect(emissions[0].values).toEqual([3]);
    });

    it('seeds a freshly added row with a null value (not 0)', () => {
      const emissions = captureEmissions();

      component.addCondition();
      component.emit();

      expect(emissions[0].values).toEqual([null]);
    });
  });
});
