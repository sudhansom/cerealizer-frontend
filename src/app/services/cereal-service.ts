import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICereal } from '../models/cereal-types';

const BASE_URL = 'http://localhost:4300/api';

@Injectable({
  providedIn: 'root',
})
export class CerealService {
  constructor(private http: HttpClient) {}

  getCereals(): Observable<ICereal[]> {
    return this.http.get<ICereal[]>(`${BASE_URL}/cereal`);
  }

  updateCereal(id: string, key: string, value: string | number): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/${id}`, { [key]: value });
  }
}
