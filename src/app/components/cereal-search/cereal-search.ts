import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISearchInputs } from '../../models/cereal-types';
import { CEREAL_TITLES, NON_SORTABLE_TITLES } from '../../models/cereal-display.constants';

const TEXT_FILTER_ITEMS = ['Mfr', 'Name', 'Type'];

@Component({
  selector: 'app-cereal-search',
  imports: [FormsModule],
  templateUrl: './cereal-search.html',
  styleUrl: './cereal-search.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerealSearch {
  /** Emitted whenever the user clicks **Go** (i.e. wants the table re-queried). */
  readonly search = output<ISearchInputs>();

  readonly titles = CEREAL_TITLES;
  readonly nonSortableTitles = NON_SORTABLE_TITLES;

  protected readonly items = signal<string[]>([]);
  protected readonly conditions = signal<string[]>([]);
  protected readonly values = signal<(string | number | null)[]>([]);

  addCondition() {
    this.items.update((arr) => [...arr, 'Calories']);
    this.conditions.update((arr) => [...arr, 'lessThan']);
    // Start the row blank instead of seeding `0`, which would otherwise be
    // emitted as a real filter the moment the user clicks Go without typing.
    this.values.update((arr) => [...arr, null]);
  }

  removeCondition(index: number) {
    this.items.update((arr) => arr.filter((_, i) => i !== index));
    this.conditions.update((arr) => arr.filter((_, i) => i !== index));
    this.values.update((arr) => arr.filter((_, i) => i !== index));
    this.emit();
  }

  /** Per-row check: is the currently selected `item` at this index a text-valued field? */
  isTextItem(index: number): boolean {
    return TEXT_FILTER_ITEMS.includes(this.items()[index] ?? '');
  }

  onItemChange(index: number, value: string) {
    this.items.update((arr) => {
      const next = [...arr];
      next[index] = value;
      return next;
    });
  }

  onConditionChange(index: number, value: string) {
    this.conditions.update((arr) => {
      const next = [...arr];
      next[index] = value;
      return next;
    });
  }

  onValueChange(index: number, value: string) {
    this.values.update((arr) => {
      const next = [...arr];
      if (this.isTextItem(index)) {
        next[index] = value;
      } else {
        // `Number('')` is `0` which would silently apply a "value=0" filter;
        // map blank numeric inputs to `null` so the service skips the row.
        next[index] = value === '' ? null : Number(value);
      }
      return next;
    });
  }

  emit() {
    this.search.emit({
      items: this.items(),
      conditions: this.conditions(),
      values: this.values(),
    });
  }
}
