import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  const authService = inject(AuthService);
  const cookieService = inject(CookieService);


  return next(req).pipe(
    catchError((err) => {

      //*this is very importnat function .. thats when token finish ==> go to create new one by refresh token ==> and re-request again 
      //* i need to study switchMap well .. 
      if (
        err.error?.errorMessage === 'jwt expired' &&
        !req.url.includes('/auth/generate-access-token')
      ) {
        return authService.generateAccessTokenByRefreshToken().pipe(
          switchMap((res) => {
            cookieService.set('accessToken', res.data);

            const newReq = req.clone({
              setHeaders: {
                authorization: 'Bearer ' + res.data,
              },
            });

            return next(newReq);
          }),
          catchError((refreshErr) => {
            toastrService.error('The session takes a period of time');
            //* there is error 'invalid algorism ' when refresh token expired , i need to delete it
            authService.signOut()
            return throwError(() => refreshErr);
          })
        );
      }



      if (err.error?.errorMessage) {
        toastrService.error(err.error.errorMessage);
      }

      return throwError(() => err);
    })
  );


};
