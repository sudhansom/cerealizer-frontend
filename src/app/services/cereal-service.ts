import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap, pipe } from 'rxjs';
import { ICereal, ISearchInputs } from '../models/cereal-types';

const BASE_URL = 'http://localhost:4300/api';

@Injectable({
  providedIn: 'root',
})
export class CerealService {
  constructor(private http: HttpClient) {}

  updateAvailable = new BehaviorSubject<boolean>(false);

  isLoggedIn = new BehaviorSubject<boolean>(false);
  nameToken = {
    name: '',
    token: '',
  };

  setNameNToken(name: string, token: string) {
    ((this.nameToken.name = name), (this.nameToken.token = token));
  }

  searchInputs = new BehaviorSubject<ISearchInputs>({
    items: new Set<string>(),
    conditions: [],
    values: [],
  });

  updateSearchInputs(inputs: ISearchInputs) {
    this.searchInputs.next(inputs);
  }

  refreshUpdate() {
    this.updateAvailable.next(true);

    setTimeout(() => {
      this.updateAvailable.next(false);
    }, 200);
  }

  getCereals(): Observable<ICereal[]> {
    return this.http.get<ICereal[]>(`${BASE_URL}/cereal`);
  }

  getFilteredCereals(item: Set<string>, value: (number | string)[], condition: string[]) {
    const items = Array.from(item);

    let url = `${BASE_URL}/cereal/filter/?`;

    items.forEach((currentItem, index) => {
      if (index > 0) url += '&';
      url += `item=${currentItem}&value=${value[index]}&condition=${condition[index]}`;
    });

    return this.http.get<ICereal[]>(url).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }

  updateCereal(id: string, key: string, value: string | number): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/${id}`, { [key]: value }).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }
  updateImage(id: string, cereal: ICereal): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/image/${id}`, cereal).pipe(
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

  loginUser(user: {
    name: string;
    password: string;
  }): Observable<{ userId: string; token: string }> {
    return this.http.post<{ userId: string; token: string }>(
      'http://localhost:4300/api/users/login',
      user,
    );
  }

  updateLogin(val: boolean) {
    this.isLoggedIn.next(val);
    if (!val) {
      this.nameToken.token = '';
    }
  }
}
