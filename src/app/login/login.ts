import { Component, inject, signal } from '@angular/core';
import { CerealService } from '../services/cereal-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loggedIn = signal(false);
  username: string = '';
  password: string = '';
  cerealService = inject(CerealService);
  submitForm() {
    this.cerealService
      .loginUser({ name: this.username, password: this.password })
      .subscribe((res) => {
        if (res.token) {
          this.loggedIn.set(true);
          localStorage.setItem('token', res.token);
          localStorage.setItem('name', this.username);
          this.cerealService.updateLogin(true);
        }
      });
  }
}
