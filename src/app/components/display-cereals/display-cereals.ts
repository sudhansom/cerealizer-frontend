import { Component, inject, Input } from '@angular/core';
import { ICereal } from '../../models/cereal-types';
import { CerealService } from '../../services/cereal-service';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-display-cereals',
  imports: [],
  templateUrl: './display-cereals.html',
  styleUrl: './display-cereals.css',
})
export class DisplayCereals {
  @Input() cereals!: ICereal[];
  cerealService = inject(CerealService);
  isFocused = false;
  titles = [
    'S.N',
    'Name',
    'Manufacturer',
    'Type',
    'Calories',
    'Protein',
    'Sodium',
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

  updateCereal(event: any, id: string, titleValue: string) {
    console.log(event.target.value, id, titleValue);
    this.cerealService.updateCereal(id, titleValue, event.target.value).subscribe((cereal) => {
      console.log(cereal);
    });
  }
}
