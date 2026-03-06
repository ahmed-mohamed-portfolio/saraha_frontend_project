import { CookieService } from 'ngx-cookie-service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const isloggedGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService)
  const router = inject(Router)

  if (cookieService.get("accessToken")) {
    return router.parseUrl('messages')
  }

  return true;
};
