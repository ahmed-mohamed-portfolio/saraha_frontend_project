import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/api/auth.service';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePicker } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../shared/components/input/input.component';
import { SkilatonComponent } from "../../shared/components/skilaton/skilaton.component";
import { AlertMessageComponent } from "../../shared/components/alert-message/alert-message.component";
import { VerificationCodeComponent } from "../verification-code/verification-code.component";




@Component({
  selector: 'app-settings',
  imports: [DatePipe, InputComponent, ReactiveFormsModule, FormsModule, DatePicker, RadioButtonModule, SkilatonComponent, AlertMessageComponent, VerificationCodeComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {


  constructor(private flowbiteService: FlowbiteService) {

  }
  private authService: AuthService = inject(AuthService)
  private toastrService: ToastrService = inject(ToastrService)
  private readonly fb = inject(FormBuilder);
  private route: Router = inject(Router)

  platformId = inject(PLATFORM_ID)
  userId: WritableSignal<string> = signal('')

  userName: WritableSignal<string> = signal('')
  lastName: WritableSignal<string> = signal('')
  userEmail: WritableSignal<string> = signal('')
  userPhone: WritableSignal<string> = signal('')
  userBOD: WritableSignal<string> = signal('')
  userGender: WritableSignal<string> = signal('')
  userProfileName: WritableSignal<string> = signal('')
  userProfileImage: WritableSignal<string> = signal('')
  editFlag: WritableSignal<boolean> = signal(false)
  valueInProfileLink: WritableSignal<string> = signal(environment.frontUrl)
  registerForm!: FormGroup
  date: Date | undefined;
  isLoading = signal<boolean>(false)
  errorMsg = signal<string>("");
  errorFlag = signal<boolean>(false);
  subscribe: Subscription = new Subscription()
  baseHost: string = environment.frontUrl
  saveFile: WritableSignal<File | null> = signal(null)
  isLoadingProfileData: WritableSignal<boolean> = signal(true);
  closeBoxFlag: WritableSignal<boolean> = signal(false);
  emailIsVerified: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {

    this.flowbite()




    if (isPlatformBrowser(this.platformId)) { //!!! i dont love this solution - i need to use httpolycookies in my project

      this.getUserNameAndEmail()

    }

  }



  editApply() {
    console.log("i am here");

    this.editFlag.set(!this.editFlag())

    this.registerInitForm();

  }

  flowbite() {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }
  getUserNameAndEmail() {

    this.isLoadingProfileData.set(true)
    this.authService.getUserById().subscribe({
      next: (res) => {

        this.flowbite()


        this.isLoadingProfileData.set(false)
        this.userId.set(res.data._id)
        this.userName.set(res.data.firstName)
        this.lastName.set(res.data.lastName)
        this.userEmail.set(res.data.email)
        this.userPhone.set(res.data.phone)
        this.userBOD.set(res.data.dateOfBirth)
        this.userProfileName.set(res.data.shareProfileName)
        this.userProfileImage.set(res.data.profilePicture)
        this.emailIsVerified.set(res.data.isVerfied)
        this.userGender.set(res.data.gender)
        if (res.data.gender == "0") {
          this.userGender.set("male")
        }
        if (res.data.gender == "1") {
          this.userGender.set("female")

        }


        if (!this.emailIsVerified()) {
          //send email
          let data = {
            userId: this.userId(),
            email: this.userEmail()
          }
          this.authService.sentVerificationEmail(data).subscribe({
            next: (res) => {
              console.log(res);
              this.toastrService.info("email sent")

            },
            error: (err) => {
              console.log(err);

            }
          })
        }
      },
      error: (err) => {
        this.isLoadingProfileData.set(false)

        console.log(err);

      }
    })
  }




  copyLink() {

    navigator.clipboard.writeText(`${environment.frontUrl}/public_message/${this.userProfileName()}`);
    this.toastrService.info("you can share link with any one", "profile url coped")

  }



  //all data input and validation
  registerInitForm() {

    this.registerForm = this.fb.group({
      firstName: [this.userName(), [Validators.minLength(3), Validators.maxLength(20)]],
      lastName: [this.lastName(), [Validators.minLength(3), Validators.maxLength(20)]],
      email: [this.userEmail(), [Validators.email]],
      password: [null, [Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/)]],
      rePassword: [null],
      phone: [this.userPhone(), [Validators.pattern(/^(01)[0125][0-9]{8}$/)]],
      dateOfBirth: [this.userBOD()],
      gender: [this.userGender(), [Validators.pattern(/^(male|female)$/)]],
      shareProfileName: [this.userProfileName(), [Validators.pattern(/^[a-z0-9]+$/)]]
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



  changeImage(e: Event) {

    let input = e.target as HTMLInputElement

    if (input.files && input.files.length > 0) {

      this.saveFile.set(input.files[0])

    }

  }



  //when press submit
  regsterSubmit() {

    if (this.registerForm.valid) {

      const formData = new FormData()

      formData.append('registerForm', JSON.stringify(this.registerForm.value))

      let file = this.saveFile()

      if (file) {
        formData.append('image', file, file.name)
      }

      this.register(formData);

    } else {
      this.registerForm.markAllAsTouched()
    }

  }


  // send login data to api and loader
  register(formData: FormData) {

    this.subscribe.unsubscribe();
    this.isLoading.set(true);
    this.subscribe = this.authService.updateUserInfos(formData).subscribe(
      {
        next: (res) => {
          console.log("UPDATE response", res);

          if (res.message == "user data updated") {
            this.toastrService.success("User data updated successfully")
            this.isLoading.set(false);
            this.errorFlag.set(false)
            this.route.navigate(["/messages"]);

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


  copyLinkFromForm(link: string) {

    navigator.clipboard.writeText(`${this.baseHost}/public_message/${link}`);
    this.toastrService.info(`${this.baseHost}/public_message/${link}`, "profile url copied")
  }

  closeBox() {
    this.closeBoxFlag.set(true)
    this.flowbite()
    console.log(
      this.closeBoxFlag()
    );

  }

  deleteAccount() {
    this.authService.deleteAccount().subscribe({
      next: (res) => {
        console.log(res);
        this.authService.signOut("all")
      },
      error: (err) => {
        console.log(err);

      }
    })
  }


  logOUtFromAllDevices() {
    this.authService.signOut("all")
  }

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();

  }
}
