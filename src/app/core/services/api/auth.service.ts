import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, REQUEST } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegisterRes } from '../../models/register-res';
import { LoginRes } from '../../models/login-res';
import { Login } from '../../models/login';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewToken } from '../../models/new-token';
import { jwtDecode } from 'jwt-decode';
import { DecodeAccessToken } from '../../models/decode-access-token';
import { UserDetails } from '../../models/user-details';
import { VerifyRes } from '../../models/verify-res';
import { UserSendEmail } from '../../models/user-send-email';
import { SentEmailRes } from '../../models/sent-email-res';
import { VerifyEmailReq } from '../../models/verify-email-req';
import { Email } from '../../models/email';
import { SendemailRes } from '../../models/sendemail-res';
import { SendCode } from '../../models/send-code';
import { OtpRes } from '../../models/otp-res';
import { InputDataResetpass } from '../../models/input-data-resetpass';
import { PassChangedRes } from '../../models/pass-changed-res';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly cookieService: CookieService = inject(CookieService)
  private readonly http: HttpClient = inject(HttpClient)
  private readonly router: Router = inject(Router)
  private readonly toastrService: ToastrService = inject(ToastrService)


  signUp(data: FormData): Observable<RegisterRes> {

    return this.http.post<RegisterRes>(environment.baseUrl + '/auth/signup', data);
  }

  login(data: Login): Observable<LoginRes> {
    return this.http.post<LoginRes>(environment.baseUrl + '/auth/login', data, { withCredentials: true });
  }

  signOut(flag: string) {

    switch (flag) {
      case "all":

        this.logOutFromAllDevices().subscribe({
          next: (res) => {
            this.router.navigate(['/login'])
            this.cookieService.delete('accessToken')
            this.toastrService.info("You have successfully logged out.", "Logout Successful")
            console.log(res);


          },
          error: (err) => {
            console.log(err);


          }
        })






        break;


      case "one":

        this.logOutFromTHisDevice().subscribe({
          next: (res) => {
            this.cookieService.delete('accessToken')
            this.router.navigate(['/login'])
            this.toastrService.info("You have successfully logged out.", "Logout Successful")
            console.log(res);

          },
          error: (err) => {
            console.log(err);


          }
        })



        break;



      case 'out':

        this.router.navigate(['/login'])
        this.cookieService.delete('accessToken')


        this.toastrService.info("You have successfully logged out.", "Logout Successful")

        break;
      default:
        console.log("problem in sifn out");

        break;
    }





  }

  logOutFromAllDevices(): Observable<any> {
    return this.http.patch(environment.baseUrl + '/auth/logout-from-all-devices', {})
  }

  logOutFromTHisDevice(): Observable<any> {
    return this.http.post(environment.baseUrl + '/auth/logout', {})
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


    return this.http.get<NewToken>(environment.baseUrl + '/auth/generate-access-token', { withCredentials: true });

  }

  decodeToken(): DecodeAccessToken | null {
    const token = this.cookieService.get('accessToken');

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<DecodeAccessToken>(token);
    } catch (error) {
      this.signOut("all");
      return null;
    }
  }

  updateUserInfos(data: FormData): Observable<RegisterRes> {

    return this.http.put<RegisterRes>(environment.baseUrl + '/user/update-user', data);
  }

  deleteAccount(): Observable<RegisterRes> {

    return this.http.delete<RegisterRes>(environment.baseUrl + '/user/delete-profile');
  }

  verifyEmail(data: VerifyEmailReq): Observable<VerifyRes> {
    return this.http.post<VerifyRes>(environment.baseUrl + '/auth/verify', data)
  }

  sentVerificationEmail(data: UserSendEmail): Observable<SentEmailRes> {
    return this.http.post<SentEmailRes>(environment.baseUrl + '/auth/sendVerificationEmail', data)
  }











  sendEmailForgetPassowrd(email: Email): Observable<SendemailRes> {
    return this.http.post<SendemailRes>(environment.baseUrl + '/auth/forget-password', email)
  }




  verifyCode(data: SendCode): Observable<OtpRes> {


    return this.http.post<OtpRes>(environment.baseUrl + '/auth/verify-code', data)
  }




  resetPassword(data: InputDataResetpass): Observable<PassChangedRes> {
    return this.http.put<PassChangedRes>(environment.baseUrl + '/auth/edit-user-password', data)
  }








  checkAuth(): Observable<{ auth: boolean }> {

    const request = inject(REQUEST, { optional: true }) as Request | null;
    const cookieHeader = request?.headers.get('cookie') ?? '';

    return this.http.get<{ auth: boolean }>(environment.baseUrl + '/get-cookie', {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      withCredentials: true,
    });

  }





}
