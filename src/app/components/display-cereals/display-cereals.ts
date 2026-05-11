import { Component, inject, Input, OnInit, signal } from '@angular/core';
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
import { Subject } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-display-cereals',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './display-cereals.html',
  styleUrl: './display-cereals.css',
})
export class DisplayCereals implements OnInit {
  @Input() cereals!: ICereal[];
  item = 'Calories';
  condition = 'lessThan';
  value = this.checkCondition() ? '' : 0;
  allItems: Set<string> = new Set<string>();
  allConditions: string[] = [];
  allValues: (string | number)[] = [];

  cerealForm!: FormGroup;
  cerealService = inject(CerealService);
  addNewCereal = false;
  editCereal = false;
  isFocused = false;
  isLoggedIn = signal(false);
  imageSelected = signal(false);
  imagePreview = '';
  showImage = signal(false);

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
    'Self',
    'Weight',
    'Cups',
    'Rating',
    'Image',
  ];
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
    'self',
    'weight',
    'cups',
    'rating',
    'image',
  ];

  ngOnInit(): void {
    this.cerealService.isLoggedIn.subscribe((val) => {
      this.isLoggedIn.set(val);
    });
    this.cerealForm = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', Validators.required),
      mfr: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      calories: new FormControl(null, Validators.required),
      protein: new FormControl(null, Validators.required),
      sodium: new FormControl(null, Validators.required),
      fiber: new FormControl(null, Validators.required),
      sugar: new FormControl(null, Validators.required),
      fat: new FormControl(null, Validators.required),
      potass: new FormControl(null, Validators.required),
      vitamins: new FormControl(null, Validators.required),
      self: new FormControl(null, Validators.required),
      weight: new FormControl(null, Validators.required),
      cups: new FormControl(null, Validators.required),
      rating: new FormControl(null, Validators.required),
      image: new FormControl(null, Validators.required),
      __v: new FormControl(0),
      id: new FormControl(''),
    });
  }

  updateCereal(event: any, id: string, titleValue: string) {
    console.log(event.target.value, id, titleValue);
    this.cerealService.updateCereal(id, titleValue, event.target.value).subscribe((cereal) => {
      console.log(cereal);
    });
  }

  addCereal() {
    if (this.addNewCereal) {
      const formData = new FormData();
      this.createFormData(formData);
      if (!this.editCereal) {
        console.log(formData.values);
        console.log('currentCereal in adding', formData);

        this.cerealService.addCereal(formData as unknown as ICereal).subscribe((cereal) => {
          console.log(cereal);
          this.addNewCereal = false;
        });
      } else {
        if (this.cerealForm.value.image) {
          formData.append('image', this.cerealForm.value.image, this.cerealForm.value.image.name);
        }
        this.cerealService
          .updateImage(this.cerealForm.value.id, formData as unknown as ICereal)
          .subscribe((cereal) => {
            console.log(cereal);
            this.editCereal = false;
          });
      }
    }

    this.addNewCereal = !this.addNewCereal;
  }
  deleteCereal(id: string) {
    if (this.isLoggedIn()) {
      this.cerealService.deleteCereal(id).subscribe((cereal) => {
        console.log('deleted', cereal);
      });
    }
  }

  onAddConditions() {
    this.allItems = new Set([...this.allItems, this.item]);
    this.allConditions = [...this.allConditions, this.condition];
    this.allValues = [...this.allValues, this.value];
  }

  fetchCereals() {
    this.onAddConditions();
    // console.log(this.allItems, this.allConditions, this.allValues);
    this.cerealService.updateSearchInputs({
      items: this.allItems,
      conditions: this.allConditions,
      values: this.allValues,
    });
    this.allItems = new Set<string>();
    this.allConditions = [];
    this.allValues = [];
  }

  checkCondition() {
    return ['Mfr', 'Name', 'Type'].includes(this.item);
  }

  onImageSelection(event: Event) {
    this.imageSelected.set(true);
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.cerealForm.patchValue({
      image: file,
    });
    this.cerealForm.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file as File);
    this.showImage.set(false);
  }

  setShowImage(value: boolean) {
    this.showImage.set(value);
    this.editCereal = !this.editCereal;
    this.addNewCereal = !this.addNewCereal;
  }

  getNsetImage(id: string) {
    const currentCereal = this.cereals.find((cereal) => cereal.id === id)!;
    const imagePath = (currentCereal.image ?? '').toString().replace(/\\/g, '/');
    this.cerealForm.setValue({ ...currentCereal });
    this.imagePreview = imagePath ? `http://localhost:4300/${imagePath}` : '';

    this.setShowImage(true);
    window.scrollTo({ top: 0 });
  }

  createFormData(formData: FormData) {
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
    formData.append('self', String(formValue.self));
    formData.append('weight', String(formValue.weight));
    formData.append('cups', String(formValue.cups));
    formData.append('rating', String(formValue.rating));
    // must be key "image" (backend expects single("image"))
    if (formValue.image) {
      formData.append('image', formValue.image, formValue.image.name);
    }
  }
}
