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
import { NewToken } from '../../models/new-token';
import { jwtDecode } from 'jwt-decode';
import { DecodeAccessToken } from '../../models/decode-access-token';


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
    this.toastrService.info("You have successfully logged out.", "Logout Successful")
  }



  googleLogin(idToken: string): Observable<LoginResByGmail> {

    return this.http.post<LoginResByGmail>(environment.baseUrl + '/auth/signup/gmail',
      { idToken }
    );

  }


  getUserById(): Observable<UserDetails> {

    return this.http.get<UserDetails>(environment.baseUrl + '/auth/get-user-by-id');

  }


  generateAccessTokenByRefreshToken(): Observable<NewToken> {

    let refreshToken = this.cookieService.get("refreshToken");

    const headers = new HttpHeaders({
      Authorization: `${refreshToken}`
    });


    return this.http.get<NewToken>(environment.baseUrl + '/auth/generate-access-token', { headers });

  }



  decodeToken(): DecodeAccessToken | null {
    const token = this.cookieService.get('accessToken');

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<DecodeAccessToken>(token);
    } catch (error) {
      this.signOut();
      return null;
    }
  }


}
