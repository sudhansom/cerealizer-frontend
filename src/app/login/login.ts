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
  username: string = 'sudhan';
  password: string = 'password';
  cerealService = inject(CerealService);
  errorMessage = signal(false);

  submitForm() {
    this.errorMessage.set(false);
    this.cerealService.loginUser({ name: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loggedIn.set(true);
        this.cerealService.setNameNToken(this.username, res.token);
        this.cerealService.updateLogin(true);
      },
      error: (err) => {
        this.errorMessage.set(true);
        this.loggedIn.set(false);
        this.cerealService.updateLogin(false);
      },
    });
  }

  setErrorMessageFalse() {
    this.errorMessage.set(false);
  }
}
