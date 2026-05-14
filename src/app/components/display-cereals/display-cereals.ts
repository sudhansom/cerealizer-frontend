import { Component, HostListener, inject, Input, OnInit, signal } from '@angular/core';
import { ICereal } from '../../models/cereal-types';
import { CerealService } from '../../services/cereal-service';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type ModalMode = 'add' | 'edit' | null;

@Component({
  selector: 'app-display-cereals',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatIconModule],
  templateUrl: './display-cereals.html',
  styleUrl: './display-cereals.css',
})
export class DisplayCereals implements OnInit {
  @Input() cereals!: ICereal[];

  item = 'Calories';
  condition = 'lessThan';
  value: string | number = this.checkCondition() ? '' : 0;
  allItems: string[] = [];
  allConditions: string[] = [];
  allValues: (string | number)[] = [];
  arrow = signal('none');

  cerealForm!: FormGroup;
  cerealService = inject(CerealService);
  isFocused = false;
  isLoggedIn = signal(false);

  // Modal state — null means the add/edit modal is closed.
  modalMode = signal<ModalMode>(null);

  // Independent image-preview overlay (used inside the modal to show the
  // selected/existing image at full size).
  imageSelected = signal(false);
  imagePreview = '';
  showImagePreview = signal(false);

  titles = [
    'S.N',
    'Name',
    'Mfr',
    'Type',
    'Calories',
    'Protein',
    'Sodium',
    'Fiber',
    'Fat',
    'Sugar',
    'Potass',
    'Vitamins',
    'Shelf',
    'Weight',
    'Cups',
    'Rating',
    'Image',
    'Actions',
  ];
  nonSortableTitles = ['S.N', 'Image', 'Actions'];
  titleValues: (keyof ICereal)[] = [
    'name',
    'mfr',
    'type',
    'calories',
    'protein',
    'sodium',
    'fiber',
    'fat',
    'sugar',
    'potass',
    'vitamins',
    'shelf',
    'weight',
    'cups',
    'rating',
    'image',
  ];

  ngOnInit(): void {
    this.cerealService.isLoggedIn.subscribe((val) => {
      this.isLoggedIn.set(val);
    });
    this.cerealForm = this.buildForm();
  }

  private buildForm(): FormGroup {
    return new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', Validators.required),
      mfr: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      calories: new FormControl<number | null>(null, Validators.required),
      protein: new FormControl<number | null>(null, Validators.required),
      sodium: new FormControl<number | null>(null, Validators.required),
      fiber: new FormControl<number | null>(null, Validators.required),
      sugar: new FormControl<number | null>(null, Validators.required),
      fat: new FormControl<number | null>(null, Validators.required),
      potass: new FormControl<number | null>(null, Validators.required),
      vitamins: new FormControl<number | null>(null, Validators.required),
      shelf: new FormControl<number | null>(null, Validators.required),
      weight: new FormControl<number | null>(null, Validators.required),
      cups: new FormControl<number | null>(null, Validators.required),
      rating: new FormControl<number | null>(null, Validators.required),
      image: new FormControl<File | string | null>(null, Validators.required),
      __v: new FormControl(0),
      id: new FormControl(''),
    });
  }

  updateCereal(event: Event, id: string, titleValue: string) {
    const target = event.target as HTMLInputElement;
    this.cerealService.updateCereal(id, titleValue, target.value).subscribe();
  }

  deleteCereal(id: string) {
    if (this.isLoggedIn()) {
      this.cerealService.deleteCereal(id).subscribe();
    }
  }

  // -------- Modal lifecycle --------

  openAddModal() {
    if (!this.isLoggedIn()) {
      return;
    }
    this.resetFormState();
    this.modalMode.set('add');
  }

  openEditModal(id: string) {
    if (!this.isLoggedIn()) {
      return;
    }
    const current = this.cereals.find((cereal) => cereal.id === id);
    if (!current) {
      return;
    }
    const imagePath = (current.image ?? '').toString().replace(/\\/g, '/');
    // API may still send Mongo field `self`; the form uses `shelf`. setValue rejects unknown keys.
    const row = current as ICereal & { self?: number; _id?: string };
    this.cerealForm.setValue({
      _id: row._id ?? '',
      name: row.name,
      mfr: row.mfr,
      type: row.type,
      calories: row.calories,
      protein: row.protein,
      sodium: row.sodium,
      fiber: row.fiber,
      sugar: row.sugar,
      fat: row.fat,
      potass: row.potass,
      vitamins: row.vitamins,
      shelf: row.shelf ?? null,
      weight: row.weight,
      cups: row.cups,
      rating: row.rating,
      image: row.image ?? null,
      __v: (row as { __v?: number }).__v ?? 0,
      id: row.id,
    });
    this.imagePreview = imagePath ? `http://localhost:4300/${imagePath}` : '';
    this.imageSelected.set(!!imagePath);
    this.modalMode.set('edit');
  }

  closeModal() {
    this.modalMode.set(null);
    this.resetFormState();
  }

  submitModal() {
    const mode = this.modalMode();
    if (!mode) {
      return;
    }
    if (this.cerealForm.invalid) {
      this.cerealForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    this.createFormData(formData);

    if (mode === 'add') {
      this.cerealService.addCereal(formData as unknown as ICereal).subscribe({
        next: () => this.closeModal(),
        error: (err) => console.error('Failed to add cereal', err),
      });
    } else {
      this.cerealService
        .updateImage(this.cerealForm.value.id, formData as unknown as ICereal)
        .subscribe({
          next: () => this.closeModal(),
          error: (err) => console.error('Failed to update cereal', err),
        });
    }
  }

  togglePreview(value: boolean) {
    this.showImagePreview.set(value);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showImagePreview()) {
      this.togglePreview(false);
      return;
    }
    if (this.modalMode()) {
      this.closeModal();
    }
  }

  private resetFormState() {
    if (this.cerealForm) {
      this.cerealForm.reset({ __v: 0, _id: '', id: '' });
    }
    this.imagePreview = '';
    this.imageSelected.set(false);
    this.showImagePreview.set(false);
  }

  // -------- Search/filter --------

  onAddConditions() {
    this.allItems = [...this.allItems, this.item];
    this.allConditions = [...this.allConditions, this.condition];
    this.allValues = [...this.allValues, this.value];
  }

  fetchCereals() {
    this.cerealService.updateSearchInputs({
      items: this.allItems,
      conditions: this.allConditions,
      values: this.allValues,
    });
  }

  checkCondition() {
    return ['Mfr', 'Name', 'Type'].includes(this.item);
  }

  removeAFilter(index: number) {
    this.allItems.splice(index, 1);
    this.allConditions.splice(index, 1);
    this.allValues.splice(index, 1);
    this.fetchCereals();
  }

  // -------- Image handling --------

  onImageSelection(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    this.imageSelected.set(true);
    this.cerealForm.patchValue({ image: file });
    this.cerealForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.showImagePreview.set(false);
  }

  private createFormData(formData: FormData) {
    const formValue = this.cerealForm.value;

    formData.append('name', formValue.name);
    formData.append('mfr', formValue.mfr);
    formData.append('type', formValue.type);
    formData.append('calories', String(formValue.calories));
    formData.append('protein', String(formValue.protein));
    formData.append('sodium', String(formValue.sodium));
    formData.append('fiber', String(formValue.fiber));
    formData.append('sugar', String(formValue.sugar));
    formData.append('fat', String(formValue.fat));
    formData.append('potass', String(formValue.potass));
    formData.append('vitamins', String(formValue.vitamins));
    formData.append('shelf', String(formValue.shelf));
    formData.append('weight', String(formValue.weight));
    formData.append('cups', String(formValue.cups));
    formData.append('rating', String(formValue.rating));
    // Only append `image` when the user picked a NEW file. In edit mode the
    // form may still hold the existing image URL (string) from the server,
    // which has no `.name` and must not be sent as the multipart payload.
    if (formValue.image instanceof File) {
      formData.append('image', formValue.image, formValue.image.name);
    }
  }

  // -------- Sorting --------

  changeSorting(title: string) {
    if (this.nonSortableTitles.includes(title)) {
      return;
    }
    if (this.arrow() === 'none') {
      this.arrow.set('arrow_downward');
    } else if (this.arrow() === 'arrow_downward') {
      this.arrow.set('arrow_upward');
    } else {
      this.arrow.set('none');
    }
    this.cerealService.updateSortOptions(title.toLowerCase(), this.arrow());
  }

  roundDownDecimal(value: number): number {
    return Math.round(value);
  }
}
