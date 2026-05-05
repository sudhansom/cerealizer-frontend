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
  cerealForm!: FormGroup;
  cerealService = inject(CerealService);
  addNewCereal = false;
  isFocused = false;
  isLoggedIn = signal(false);
  imageSelected = signal(false);
  imagePreview = '';

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
      this.cerealService.addCereal(this.cerealForm.value).subscribe((cereal) => {
        console.log(cereal);
      });
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

  onChangeItem() {
    console.log('updated....');
    this.cerealService.updateSearchInputs({
      item: this.item,
      condition: this.condition,
      value: this.value,
    });
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
  }
}
