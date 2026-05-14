import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap, pipe } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICereal, ISearchInputs } from '../models/cereal-types';

const BASE_URL = `${environment.apiHost}/api`;

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

  sortOptions = new BehaviorSubject<{ item: string; condition: string }>({
    item: '',
    condition: '',
  });

  updateSortOptions(item: string, condition: string) {
    this.sortOptions.next({
      item,
      condition,
    });
    this.refreshUpdate();
  }

  setNameNToken(name: string, token: string) {
    ((this.nameToken.name = name), (this.nameToken.token = token));
  }

  searchInputs = new BehaviorSubject<ISearchInputs>({
    items: [],
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
    return this.http.get<ICereal[]>(
      `${BASE_URL}/cereal/sorting/?item=${this.sortOptions.value.item}&condition=${this.sortOptions.value.condition}`,
    );
  }

  getFilteredCereals(
    item: string[],
    value: (number | string | null)[],
    condition: string[],
  ) {
    const items = Array.from(item);

    let url = `${BASE_URL}/cereal/filter/?`;
    let appended = 0;

    items.forEach((currentItem, index) => {
      const v = value[index];
      // Skip rows with no value selected so we don't emit `value=null` /
      // `value=undefined` query params that the backend would mis-interpret.
      if (v === null || v === undefined || v === '') {
        return;
      }
      if (appended > 0) url += '&';
      url += `item=${currentItem.toLowerCase()}&value=${v}&condition=${condition[index]}`;
      appended += 1;
    });

    return this.http.get<ICereal[]>(url);
  }

  updateCereal(id: string, key: string, value: string | number): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/${id}`, { [key]: value }).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }
  // `payload` is typed as `ICereal | FormData` because the form dialog
  // submits multipart/form-data (it has to, to attach the image File);
  // HttpClient knows how to serialize either, so accepting both removes
  // the need for `as unknown as ICereal` casts at call sites.
  updateImage(id: string, payload: ICereal | FormData): Observable<ICereal> {
    return this.http.put<ICereal>(`${BASE_URL}/cereal/image/${id}`, payload).pipe(
      tap(() => {
        this.refreshUpdate();
      }),
    );
  }

  addCereal(payload: ICereal | FormData) {
    return this.http.post<ICereal>(`${BASE_URL}/cereal`, payload).pipe(
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
    return this.http.post<{ userId: string; token: string }>(`${BASE_URL}/users/login`, user);
  }

  updateLogin(val: boolean) {
    this.isLoggedIn.next(val);
    if (!val) {
      this.nameToken.token = '';
    }
  }
}
