import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CerealService } from '../../services/cereal-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  cerealService = inject(CerealService);
  isLoggedIn = signal(false);
  userName = signal('');

  ngOnInit(): void {
    this.cerealService.isLoggedIn.subscribe((val) => {
      this.isLoggedIn.set(val);
      this.userName.set(this.cerealService.nameToken.name); // check this please
    });
  }
  logoutUser() {
    this.cerealService.updateLogin(false);
    this.userName.set('');
    this.cerealService.setNameNToken('', '');
  }

  loginUser() {}
}
