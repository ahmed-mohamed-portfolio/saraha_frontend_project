import { CanActivateFn, Router } from '@angular/router';
import { inject, REQUEST } from '@angular/core';
import { AuthService } from '../services/api/auth.service';
import { catchError, map, of } from 'rxjs';


export const isloggedGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)
  const authService = inject(AuthService)

  return authService.checkAuth().pipe(
    map((response) => response.auth ? router.parseUrl('/messages') : true),
    catchError(() => of(true))
  );

};


