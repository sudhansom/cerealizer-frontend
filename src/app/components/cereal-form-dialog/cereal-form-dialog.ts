import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICereal } from '../../models/cereal-types';
import {
  CEREAL_API_HOST,
  CEREAL_FIELDS,
  isTextField,
} from '../../models/cereal-display.constants';

export type CerealDialogMode = 'add' | 'edit';

interface CerealRowSnapshot extends ICereal {
  self?: number;
  _id?: string;
  __v?: number;
}

@Component({
  selector: 'app-cereal-form-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './cereal-form-dialog.html',
  styleUrl: './cereal-form-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CerealFormDialog implements OnInit {
  readonly mode = input.required<CerealDialogMode>();
  readonly initial = input<ICereal | null>(null);

  readonly submitForm = output<FormData>();
  readonly cancel = output<void>();

  readonly cerealForm = this.buildForm();
  readonly fields = CEREAL_FIELDS;

  protected readonly imageSelected = signal(false);
  protected readonly imagePreview = signal('');
  protected readonly showImagePreview = signal(false);

  protected readonly title = computed(() =>
    this.mode() === 'edit' ? 'Edit cereal' : 'Add a new cereal',
  );
  protected readonly submitLabel = computed(() =>
    this.mode() === 'edit' ? 'Save changes' : 'Add cereal',
  );

  ngOnInit(): void {
    const seed = this.initial();
    if (this.mode() === 'edit' && seed) {
      this.loadFromCereal(seed);
    }
  }

  protected isTextField(field: keyof ICereal | string): boolean {
    return isTextField(field);
  }

  protected onSubmit() {
    if (this.cerealForm.invalid) {
      this.cerealForm.markAllAsTouched();
      return;
    }
    this.submitForm.emit(this.toFormData());
  }

  protected onCancel() {
    this.cancel.emit();
  }

  protected onImageSelection(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) {
      return;
    }
    this.imageSelected.set(true);
    this.cerealForm.patchValue({ image: file });
    this.cerealForm.get('image')?.updateValueAndValidity();
    this.showImagePreview.set(false);
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.onerror = () => this.resetImagePreview();
    reader.onabort = () => this.resetImagePreview();
    reader.readAsDataURL(file);
  }

  private resetImagePreview() {
    this.imagePreview.set('');
    this.imageSelected.set(false);
    this.showImagePreview.set(false);
    this.cerealForm.patchValue({ image: null });
    this.cerealForm.get('image')?.updateValueAndValidity();
  }

  protected togglePreview(value: boolean) {
    this.showImagePreview.set(value);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showImagePreview()) {
      this.togglePreview(false);
      return;
    }
    this.onCancel();
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

  private loadFromCereal(row: ICereal) {
    const snapshot = row as CerealRowSnapshot;
    const imagePath = (row.image ?? '').toString().replace(/\\/g, '/');
    this.cerealForm.setValue({
      _id: snapshot._id ?? '',
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
      __v: snapshot.__v ?? 0,
      id: row.id,
    });
    this.imagePreview.set(imagePath ? `${CEREAL_API_HOST}/${imagePath}` : '');
    this.imageSelected.set(!!imagePath);
  }

  private toFormData(): FormData {
    const formData = new FormData();
    const value = this.cerealForm.value;
    for (const field of CEREAL_FIELDS) {
      if (field === 'image') {
        continue;
      }
      formData.append(field, String(value[field]));
    }
    // Only attach `image` when the user picked a new file; in edit mode the
    // form may still hold the existing image URL (a string) coming back
    // from the server, which has no `.name` and must not be sent.
    if (value.image instanceof File) {
      formData.append('image', value.image, value.image.name);
    }
    return formData;
  }
}
