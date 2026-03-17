import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../core/services/api/auth.service';
import { environment } from '../../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-settings',
  imports: [DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {


  constructor(private flowbiteService: FlowbiteService) { }
  private authService: AuthService = inject(AuthService)
  private toastrService: ToastrService = inject(ToastrService)
  platformId = inject(PLATFORM_ID)

  userName: WritableSignal<string> = signal('')
  lastName: WritableSignal<string> = signal('')
  userEmail: WritableSignal<string> = signal('')
  userPhone: WritableSignal<string> = signal('')
  userBOD: WritableSignal<string> = signal('')
  userProfileName: WritableSignal<string> = signal('')
  userProfileImage: WritableSignal<string> = signal('')

  valueInProfileLink: WritableSignal<string> = signal(environment.frontUrl)

  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    if (isPlatformBrowser(this.platformId)) { //!!! i dont love this solution - i need to use httpolycookies in my project

      this.getUserNameAndEmail()

    }

  }


  getUserNameAndEmail() {
    this.authService.getUserById().subscribe({
      next: (res) => {
        this.userName.set(res.data.firstName)
        this.lastName.set(res.data.lastName)
        this.userEmail.set(res.data.email)
        this.userPhone.set(res.data.phone)
        this.userBOD.set(res.data.dateOfBirth)
        this.userProfileName.set(res.data.shareProfileName)
        this.userProfileImage.set(res.data.profilePicture)
      },
      error: (err) => {
        console.log(err);

      }
    })
  }




  copyLink() {

    navigator.clipboard.writeText(`${environment.frontUrl}/public_message/${this.userProfileName()}`);
    this.toastrService.info("you can share link with any one", "profile url coped")

  }

}
