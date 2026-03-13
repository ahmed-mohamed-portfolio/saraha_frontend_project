import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  let toastrService: ToastrService = inject(ToastrService)


  return next(req).pipe(catchError((err) => {
    if (err.error.errorMessage != "jwt expired") {         //!!!i need some oone check this after me - no one teach me that - that may get bad behaviour

      toastrService.error(err.error.errorMessage)
    }
    return throwError(() => err)
  }))
};
