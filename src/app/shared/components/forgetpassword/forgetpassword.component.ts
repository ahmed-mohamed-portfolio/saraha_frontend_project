
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { CookieService } from 'ngx-cookie-service';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InputComponent } from '../input/input.component';
import { AuthService } from '../../../core/services/api/auth.service';
import { NavbarComponent } from "../navbar/navbar.component";
import { SendCode } from '../../../core/models/send-code';
import { InputDataResetpass } from '../../../core/models/input-data-resetpass';



@Component({
  selector: 'app-forgetpassword',
  imports: [InputComponent, ReactiveFormsModule, StepperModule, ButtonModule, NavbarComponent],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.scss',
})
export class ForgetpasswordComponent {


  private readonly auth = inject(AuthService)
  private readonly cookieService = inject(CookieService)
  private readonly fb = inject(FormBuilder)
  private readonly routes = inject(Router)
  private toastrService = inject(ToastrService)
  forgetEmailForm!: FormGroup;
  getCodeForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  userid: WritableSignal<string> = signal('');



  ngOnInit(): void {

    this.initForm();
  }




  //get all forms data
  initForm() {

    this.forgetEmailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    });

    this.getCodeForm = this.fb.group({
      resetCode: [null, [Validators.required]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: [null, [Validators.required]]
    });

  }




  //email that user forget password
  emailSubmit(activateCallback: Function) {

    if (this.forgetEmailForm.valid) {
      console.log("this.forgetEmailForm.value", this.forgetEmailForm.value);

      this.auth.sendEmailForgetPassowrd(this.forgetEmailForm.value).subscribe({
        next: (res) => {
          if (res.message === "email sent") {
            this.userid.set(res.data._id)
            console.log(res);
            activateCallback(2);
          }
        },
        error: (err) => {
          console.log(err);
        }
      })


    } else {
      this.forgetEmailForm.markAllAsTouched()
    }


  }






  //send code to user
  codeSubmit(activateCallback: Function) {

    if (this.getCodeForm.valid) {

      let data: SendCode = {
        userId: this.userid(),
        code: this.getCodeForm.value
      }

      console.log("data", data);

      this.auth.verifyCode(data).subscribe({
        next: (res) => {

          if (res.message === "valid otp") {
            console.log(res);
            activateCallback(3)
          }
        },
        error: (err) => {
          console.log(err);


        }
      })


    } else {
      this.forgetEmailForm.markAllAsTouched()
    }


  }








  //enter email and new passworrd
  emailAndNewPass() {

    if (this.resetPasswordForm.valid) {

      this.resetPassword();

    } else {
      this.forgetEmailForm.markAllAsTouched()
    }


  }






  resetPassword() {

    let inputData: InputDataResetpass = {
      userId: this.userid(),
      newPassword: this.resetPasswordForm.value
    }
    console.log("inputData", inputData);

    this.auth.resetPassword(inputData).subscribe({
      next: (res) => {
        if (res.message == "password changed") {
          console.log(res);

          this.toastrService.info("you set new password successfully")

          this.routes.navigate(['/login'])
        }

      },
      error: (err) => {
        console.log(err);


      }
    })
  }








}
