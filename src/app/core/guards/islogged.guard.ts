import { CookieService } from 'ngx-cookie-service';
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';

export const isloggedGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService)
  const router = inject(Router)

  console.log(cookieService.get("accessToken"));

  if (cookieService.get("accessToken")) {
    return router.parseUrl('messages')
  }

  return true;
};
