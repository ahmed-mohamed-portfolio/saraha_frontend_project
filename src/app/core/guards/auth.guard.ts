import { isPlatformServer } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService)
  const router = inject(Router)

  //!!! that is dangerous and i need to change it
  let platformId = inject(PLATFORM_ID)
  if (isPlatformServer(platformId)) {
    return true
  }


  if (cookieService.get('accessToken')) {
    return true
  }
  else {
    return router.parseUrl('/login')
  }
};
