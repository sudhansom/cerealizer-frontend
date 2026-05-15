import { Component, ErrorHandler, Input, OnInit, inject, signal } from '@angular/core';
import { ICereal, ISearchInputs } from '../../models/cereal-types';
import { CerealService } from '../../services/cereal-service';
import {
  CerealFormDialog,
  CerealDialogMode,
} from '../cereal-form-dialog/cereal-form-dialog';
import { CerealSearch } from '../cereal-search/cereal-search';
import { CellChange, CerealTable, SortChange } from '../cereal-table/cereal-table';

@Component({
  selector: 'app-display-cereals',
  imports: [CerealSearch, CerealTable, CerealFormDialog],
  templateUrl: './display-cereals.html',
  styleUrl: './display-cereals.css',
})
export class DisplayCereals implements OnInit {
  @Input() cereals: ICereal[] = [];

  private readonly cerealService = inject(CerealService);
  private readonly errorHandler = inject(ErrorHandler);

  protected readonly isLoggedIn = signal(false);
  protected readonly modalMode = signal<CerealDialogMode | null>(null);
  protected readonly editingCereal = signal<ICereal | null>(null);

  ngOnInit(): void {
    this.cerealService.isLoggedIn.subscribe((value) => this.isLoggedIn.set(value));
  }

  protected openAdd() {
    if (!this.isLoggedIn()) {
      return;
    }
    this.editingCereal.set(null);
    this.modalMode.set('add');
  }

  protected openEdit(id: string) {
    if (!this.isLoggedIn()) {
      return;
    }
    const target = this.cereals.find((c) => c.id === id);
    if (!target) {
      return;
    }
    this.editingCereal.set(target);
    this.modalMode.set('edit');
  }

  protected closeModal() {
    this.modalMode.set(null);
    this.editingCereal.set(null);
  }

  protected onSubmit(formData: FormData) {
    const mode = this.modalMode();
    if (mode === 'add') {
      this.cerealService.addCereal(formData).subscribe({
        next: () => this.closeModal(),
        error: (err) =>
          this.errorHandler.handleError(
            new Error('Failed to add cereal', { cause: err }),
          ),
      });
      return;
    }
    const editing = this.editingCereal();
    if (mode === 'edit' && editing) {
      this.cerealService.updateImage(editing.id, formData).subscribe({
        next: () => this.closeModal(),
        error: (err) =>
          this.errorHandler.handleError(
            new Error('Failed to update cereal', { cause: err }),
          ),
      });
    }
  }

  protected onSearch(inputs: ISearchInputs) {
    this.cerealService.updateSearchInputs(inputs);
  }

  protected onSort(change: SortChange) {
    this.cerealService.updateSortOptions(change.field, change.direction);
  }

  protected onCellChange(change: CellChange) {
    this.cerealService.updateCereal(change.id, change.key, change.value).subscribe();
  }

  protected onDelete(id: string) {
    if (!this.isLoggedIn()) {
      return;
    }
    this.cerealService.deleteCereal(id).subscribe({
      error: (err) =>
        this.errorHandler.handleError(
          new Error('Failed to delete cereal', { cause: err }),
        ),
    });
  }
}
