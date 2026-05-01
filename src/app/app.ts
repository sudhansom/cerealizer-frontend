import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Navbar } from './components/navbar/navbar';
import { DisplayCereals } from './components/display-cereals/display-cereals';
import { ICereal } from './models/cereal-types';
import { CerealService } from './services/cereal-service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    Navbar,
    DisplayCereals,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('cereal-frontend');

  cereals = signal<ICereal[]>([]);
  cerealService = inject(CerealService);

  ngOnInit(): void {
    this.loadData();
    this.cerealService.updateAvailable.subscribe((data) => {
      console.log('data loaded', data);
      this.loadData();
    });
  }

  loadData() {
    this.cerealService.getCereals().subscribe((cereals) => {
      this.cereals.set(cereals);
    });
  }
}
