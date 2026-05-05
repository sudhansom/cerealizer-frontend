import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CerealService } from './services/cereal-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const cerealService = inject(CerealService);
  // Skip adding token for authentication endpoints
  const isAuthRequest =
    req.url.includes('/login') || req.url.includes('/signup') || req.url.includes('/refresh');
  if (isAuthRequest) {
    return next(req);
  }
  // Skip interceptor entirely on server
  if (isPlatformServer(platformId)) {
    return next(req);
  }
  const token = cerealService.nameToken.token;

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const cerealService = inject(CerealService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        router.navigate(['/']);
        cerealService.setNameNToken('', '');
      }
      return throwError(() => error);
    }),
  );
};
