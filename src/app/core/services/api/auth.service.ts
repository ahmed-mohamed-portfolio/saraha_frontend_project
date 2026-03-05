import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegisterRes } from '../../models/register-res';
import { Register } from '../../models/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  http: HttpClient = inject(HttpClient)

  signUp(data: Register): Observable<RegisterRes> {

    console.log(environment.baseUrl + '/auth/signup');
    return this.http.post<any>(environment.baseUrl + '/auth/signup', data);

  }

}
