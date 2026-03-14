import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegisterRes } from '../../models/register-res';
import { Register } from '../../models/register';
import { LoginRes } from '../../models/login-res';
import { Login } from '../../models/login';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly cookieService: CookieService = inject(CookieService)
  private readonly http: HttpClient = inject(HttpClient)
  private readonly router: Router = inject(Router)
  private readonly toastrService: ToastrService = inject(ToastrService)


  signUp(data: Register): Observable<RegisterRes> {
    return this.http.post<RegisterRes>(environment.baseUrl + '/auth/signup', data);
  }


  login(data: Login): Observable<LoginRes> {
    return this.http.post<LoginRes>(environment.baseUrl + '/auth/login', data);
  }


  signOut() {
    this.cookieService.delete('accessToken')
    this.cookieService.delete('refreshToken')

    this.router.navigate(['/login'])
    this.toastrService.info('You have successfully logged out')
  }

  decodeToken() {
    let decode

    try {
      decode = jwtDecode(this.cookieService.get('accessToken'))
    } catch (error) {
      this.signOut()
    }

    return decode

  }





  googleLogin(idToken: string): Observable<LoginResByGmail> {

    return this.http.post<LoginResByGmail>(environment.baseUrl + '/auth/signup/gmail',
      { idToken }
    );

  }


  getUserById(): Observable<any> { //not used yet

    return this.http.get(environment.baseUrl + '/auth/get-user-by-id');

  }


  generateAccessTokenByRefreshToken(): Observable<any> {

    let refreshToken = this.cookieService.get("refreshToken");
    console.log("refreshtoken", refreshToken);

    const headers = new HttpHeaders({
      Authorization: `${refreshToken}`
    });


    return this.http.get(environment.baseUrl + '/auth/generate-access-token', { headers });

  }



}
