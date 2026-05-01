import { Component, inject, Input, OnInit } from '@angular/core';
import { ICereal } from '../../models/cereal-types';
import { CerealService } from '../../services/cereal-service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-display-cereals',
  imports: [ReactiveFormsModule],
  templateUrl: './display-cereals.html',
  styleUrl: './display-cereals.css',
})
export class DisplayCereals implements OnInit {
  @Input() cereals!: ICereal[];
  cerealForm!: FormGroup;
  cerealService = inject(CerealService);
  addNewCereal = false;
  isFocused = false;
  titles = [
    'S.N',
    'Name',
    'Manufacturer',
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
    this.cerealForm = new FormGroup({
      name: new FormControl('dfdsfds', Validators.required),
      mfr: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      calories: new FormControl(0, Validators.required),
      protein: new FormControl(0, Validators.required),
      sodium: new FormControl(0, Validators.required),
      fiber: new FormControl(0, Validators.required),
      fat: new FormControl(0, Validators.required),
      potass: new FormControl(0, Validators.required),
      vitamins: new FormControl(0, Validators.required),
      self: new FormControl(0, Validators.required),
      cups: new FormControl(0, Validators.required),
      rating: new FormControl(0, Validators.required),
      image: new FormControl(0, Validators.required),
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
      alert('Saved');
    }
    this.addNewCereal = !this.addNewCereal;
  }
}
