import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ICereal } from '../../models/cereal-types';
import {
  CEREAL_FIELDS,
  CEREAL_TITLES,
  CerealTitle,
  NON_SORTABLE_TITLES,
} from '../../models/cereal-display.constants';

type SortArrow = 'none' | 'arrow_downward' | 'arrow_upward';

export interface SortChange {
  /** Title clicked, lower-cased to match a backend field name. */
  field: string;
  /** Resulting arrow direction (`none` => unsorted). */
  direction: SortArrow;
}

export interface CellChange {
  id: string;
  key: string;
  value: string;
}

@Component({
  selector: 'app-cereal-table',
  imports: [MatIconModule],
  templateUrl: './cereal-table.html',
  styleUrl: './cereal-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerealTable {
  readonly cereals = input.required<ICereal[]>();
  readonly isLoggedIn = input.required<boolean>();

  readonly sortChange = output<SortChange>();
  readonly cellChange = output<CellChange>();
  readonly deleteRow = output<string>();
  readonly editRow = output<string>();

  readonly titles = CEREAL_TITLES;
  readonly fields = CEREAL_FIELDS;
  readonly nonSortableTitles = NON_SORTABLE_TITLES;

  protected readonly arrow = signal<SortArrow>('none');
  protected isFocused = false;

  protected isSortable(title: CerealTitle): boolean {
    return !this.nonSortableTitles.includes(title);
  }

  protected onHeaderClick(title: CerealTitle) {
    if (!this.isSortable(title)) {
      return;
    }
    const next = this.nextArrow(this.arrow());
    this.arrow.set(next);
    this.sortChange.emit({ field: title.toLowerCase(), direction: next });
  }

  protected onCellChange(event: Event, id: string, key: string) {
    const value = (event.target as HTMLInputElement).value;
    this.cellChange.emit({ id, key, value });
  }

  protected onDelete(id: string) {
    this.deleteRow.emit(id);
  }

  protected onEditImage(id: string) {
    this.editRow.emit(id);
  }

  protected roundDownDecimal(value: number): number {
    return Math.floor(value);
  }

  private nextArrow(current: SortArrow): SortArrow {
    switch (current) {
      case 'none':
        return 'arrow_downward';
      case 'arrow_downward':
        return 'arrow_upward';
      default:
        return 'none';
    }
  }
}
