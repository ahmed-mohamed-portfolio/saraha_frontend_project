import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegisterRes } from '../../models/register-res';
import { Register } from '../../models/register';
import { LoginRes } from '../../models/login-res';
import { Login } from '../../models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http: HttpClient = inject(HttpClient)

  signUp(data: Register): Observable<RegisterRes> {
    return this.http.post<any>(environment.baseUrl + '/auth/signup', data);
  }


  login(data: Login): Observable<LoginRes> {
    return this.http.post<any>(environment.baseUrl + '/auth/login', data);
  }

}
