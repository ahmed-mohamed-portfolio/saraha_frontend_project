import { AuthService } from './../../services/api/auth.service';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';


declare const google: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {


  flag: boolean = true;
  private readonly fb = inject(FormBuilder)
  loginForm!: FormGroup;
  errorMsg = signal<string>("");
  private readonly toastrService: ToastrService = inject(ToastrService)
  private readonly cookieService = inject(CookieService)

  //* api variables
  authService: AuthService = inject(AuthService)
  private router: Router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  subscribe: Subscription = new Subscription()

  ngOnInit(): void {
    this.loginInitForm();
    this.handleGoogleRedirectError();
  }


  //* for eye icon in html
  changeFlag() { this.flag = !this.flag }

  //* all data input and validation
  loginInitForm(): void {

    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]]
    })

  }

  //* when press submit
  loginSubmit() {

    if (this.loginForm.valid) {

      this.logIn();
    } else {
      this.loginForm.markAllAsTouched()
    }

  }



  //* send login data to api and loader
  logIn() {
    this.subscribe.unsubscribe();
    console.log(this.loginForm.value);

    this.subscribe = this.authService.login(this.loginForm.value).subscribe(
      {
        next: (res) => {
          console.log("login response", res);

          if (res.message == "user login successfully") {
            this.afterUserSuccessLogin(res.data.accessToken, res.data.refreshToken)
          }
        },

        error: (err) => {

          console.log("login error", err);

        },

      })
  }





  //* sign in with google
  private googleInitialized = false;

  private platformId = inject(PLATFORM_ID);


  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.initializeGoogle();
  }

  private initializeGoogle(): void {
    if (typeof google === 'undefined' || !google?.accounts?.id) {
      console.error('Google SDK not loaded');
      return;
    }

    google.accounts.id.initialize({
      client_id: '454721329331-ieb8vd87r8mlk8bjf4p60ogm0n5biljd.apps.googleusercontent.com',
      ux_mode: 'redirect',
      login_uri: `${environment.baseUrl}/auth/signup/gmail`,
      context: 'signup',
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
      }
    );

    this.googleInitialized = true;
  }

  loginWithGoogle(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.googleInitialized) return;

    //*thats mean when i click on my button will click in the google hidden button
    const realGoogleButton = document.querySelector(
      '#google-btn div[role="button"]'
    ) as HTMLElement | null;

    realGoogleButton?.click();
  }

  private handleGoogleRedirectError(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const googleError = this.activatedRoute.snapshot.queryParamMap.get('googleError');

    if (!googleError) {
      return;
    }

    this.errorMsg.set(googleError);
    this.toastrService.error(googleError, 'Google Sign Up Failed');
    this.router.navigate([], {
      queryParams: { googleError: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }





  afterUserSuccessLogin(accessToken: string, refreshToken: string) {
    this.cookieService.set('accessToken', accessToken)
    this.cookieService.set('refreshToken', refreshToken)

    this.toastrService.success("You have logged in successfully.", "Login Successful")
    this.router.navigate(["/messages"])
  }


  ngOnDestroy(): void {
    this.subscribe.unsubscribe();

  }
}
