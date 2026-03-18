import { AuthService } from './../../../core/services/api/auth.service';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})

export class NavbarComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) { }
  private readonly cookieService = inject(CookieService)
  private readonly router: Router = inject(Router)
  private readonly toastrService: ToastrService = inject(ToastrService)
  private readonly authService: AuthService = inject(AuthService)

  @Input({ required: true }) isLogin!: boolean;

  userName: WritableSignal<string> = signal('')
  lastName: WritableSignal<string> = signal('')
  userEmail: WritableSignal<string> = signal('')
  userProfileImage: WritableSignal<string> = signal('')

  platformId = inject(PLATFORM_ID)


  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });



    if (isPlatformBrowser(this.platformId)) { //!!! i dont love this solution - i need to use httpolycookies in my project

      if (this.isLogin) {

        this.getUserNameAndEmail()
      }

    }


  }



  signOut() {
    this.authService.signOut()
  }



  getUserNameAndEmail() {
    this.authService.getUserById().subscribe({
      next: (res) => {
        this.userEmail.set(res.data.email)

        this.userName.set(res.data.firstName + ' ' + res.data.lastName)
        this.userProfileImage.set(res.data.profilePicture)
        console.log("GET user by id", res);

      },
      error: (err) => {
        console.log(err);

      }
    })
  }




}
