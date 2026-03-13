import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  let cookieService: CookieService = inject(CookieService)

  if (!req.url.includes("/auth/generate-access-token")) {//* i send access token with hheader manually in that link
    if (cookieService.check('accessToken')) {
      req = req.clone({ setHeaders: { authorization: 'Bearer ' + cookieService.get('accessToken') } })
    }
  }


  return next(req);

};
