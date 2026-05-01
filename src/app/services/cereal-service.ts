import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap, pipe } from 'rxjs';
import { ICereal } from '../models/cereal-types';

const BASE_URL = 'http://localhost:4300/api';

@Injectable({
  providedIn: 'root',
})
export class CerealService {
  constructor(private http: HttpClient) {}

  updateAvailable = new BehaviorSubject<boolean>(false);

  refreshUpdate() {
    this.updateAvailable.next(true);

    setTimeout(() => {
      this.updateAvailable.next(false);
    }, 200);
  }

  getCereals(): Observable<ICereal[]> {
    return this.http.get<ICereal[]>(`${BASE_URL}/cereal`);
  }

  updateCereal(id: string, key: string, value: string | number): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/${id}`, { [key]: value }).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }

  addCereal(cereal: ICereal) {
    return this.http.post<ICereal>(`${BASE_URL}/cereal`, cereal).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }

  deleteCereal(id: string) {
    return this.http.delete<ICereal>(`${BASE_URL}/cereal/${id}`).pipe(
      tap({
        next: () => {
          console.log('delete in service - success');
          this.refreshUpdate();
        },
        error: (err) => {
          console.log('delete in service - error:', err);
        },
      }),
    );
  }
}
