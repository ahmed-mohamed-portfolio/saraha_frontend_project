import { AuthService } from './../../core/services/api/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-code',
  imports: [ReactiveFormsModule],
  templateUrl: './verification-code.component.html',
  styleUrl: './verification-code.component.scss',
})
export class VerificationCodeComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) { }
  private authService: AuthService = inject(AuthService)
  private toastrService: ToastrService = inject(ToastrService)
  codeForm!: FormGroup
  private readonly fb = inject(FormBuilder);
  private route: Router = inject(Router)

  code: string = ""

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });


    this.registerInitForm();

  }




  //all data input and validation
  registerInitForm() {

    this.codeForm = this.fb.group({
      codePart1: [null, [Validators.required]],
      codePart2: [null, [Validators.required]],
      codePart3: [null, [Validators.required]],
      codePart4: [null, [Validators.required]],

    })

  }



  regsterSubmit() {

    if (this.codeForm.valid) {

      this.register();

    } else {
      this.codeForm.markAllAsTouched()
    }

  }


  register() {
    let userEmail = sessionStorage.getItem('email')
    this.code = `${this.codeForm.value.codePart1}${this.codeForm.value.codePart2}${this.codeForm.value.codePart3}${this.codeForm.value.codePart4}`
    let data = {
      email: userEmail,
      code: this.code
    }
    this.authService.verifyEmail(data).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data.isVerfied) {
          this.toastrService.success("sign in now", "email verified");
          this.route.navigate(["/login"]);
        }
      },
      error: (err) => {

        console.log(err);

      }
    })

  }


}