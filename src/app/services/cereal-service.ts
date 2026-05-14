import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    // Use HttpParams so values containing `&`, `=`, `?`, or any unicode are
    // URL-encoded by Angular instead of corrupting the query string. The
    // backend expects repeated `item`/`value`/`condition` triplets, which
    // HttpParams supports natively via `.append`.
    let params = new HttpParams();
    item.forEach((currentItem, index) => {
      const v = value[index];
      // Skip rows the user left blank so the backend doesn't see a stray
      // `value=` / `value=null` and treat it as a real filter.
      if (v === null || v === undefined || v === '') {
        return;
      }
      params = params
        .append('item', currentItem.toLowerCase())
        .append('value', String(v))
        .append('condition', condition[index]);
    });

    return this.http.get<ICereal[]>(`${BASE_URL}/cereal/filter/`, { params });
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
    // Error handling is the caller's responsibility (so it can route failures
    // through the central ErrorHandler or surface them in the UI); the
    // service only takes care of refreshing on success.
    return this.http.delete<ICereal>(`${BASE_URL}/cereal/${id}`).pipe(
      tap(() => this.refreshUpdate()),
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
