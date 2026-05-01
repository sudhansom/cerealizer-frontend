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
    this.cerealService.deleteCereal(id).subscribe((cereal) => {
      console.log('deleted', cereal);
    });
  }
}
