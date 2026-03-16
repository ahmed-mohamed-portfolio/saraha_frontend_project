import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { InputComponent } from "../../../shared/components/input/input.component";
import { Subscription } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/api/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment.development';


@Component({
  selector: 'app-register',
  imports: [InputComponent, ReactiveFormsModule, FormsModule, DatePicker, RadioButtonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})

export class RegisterComponent implements OnInit, OnDestroy {

  private authService: AuthService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly toastrService: ToastrService = inject(ToastrService)
  private route: Router = inject(Router)


  registerForm!: FormGroup
  date: Date | undefined;
  isLoading = signal<boolean>(false)
  errorMsg = signal<string>("");
  errorFlag = signal<boolean>(false);
  subscribe: Subscription = new Subscription()
  baseHost: string = environment.frontUrl


  ngOnInit(): void {

    this.registerInitForm();

  }



  //all data input and validation
  registerInitForm() {

    this.registerForm = this.fb.group({
      userName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]],
      rePassword: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/^(01)[0125][0-9]{8}$/)]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required, Validators.pattern(/^(male|female)$/)]],
      shareProfileName: [null, [Validators.required, Validators.pattern(/^[a-z0-9]+$/)]]
    }, { validators: this.matchValid });

  }



  // custom validation if password != repassword
  matchValid(vGroup: AbstractControl) {

    if (vGroup.get('password')?.value === vGroup.get('rePassword')?.value) {
      return null
    } else {

      vGroup.get('rePassword')?.setErrors({ matchpassword: true })
      return { matchpassword: true };
    }

  }


  //when press submit
  regsterSubmit() {

    if (this.registerForm.valid) {

      this.register();

    } else {
      this.registerForm.markAllAsTouched()
    }

  }


  // send login data to api and loader
  register() {

    this.subscribe.unsubscribe();
    this.isLoading.set(true);
    this.subscribe = this.authService.signUp(this.registerForm.value).subscribe(
      {
        next: (res) => {
          console.log("register response", res);

          if (res.message == "user added") {
            this.toastrService.success("You can log in now.", "User registered successfully")
            this.isLoading.set(false);
            this.errorFlag.set(false)
            this.route.navigate(["/login"]);
          }
        },

        error: (err) => {

          console.log("register error", err);

          this.errorFlag.set(true)
          this.errorMsg.set(err.error.errorMessage)
          this.isLoading.set(false);
        },

      })

  }


  copyLink(link: string) {

    navigator.clipboard.writeText(`${this.baseHost}/public_message/${link}`);
    this.toastrService.info(`${this.baseHost}/public_message/${link}`, "profile url copied")
  }


  ngOnDestroy(): void {
    this.subscribe.unsubscribe();

  }
}
