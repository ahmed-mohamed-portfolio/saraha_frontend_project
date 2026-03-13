import { AuthService } from './../../../core/services/api/auth.service';
import { Component, inject, Input, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { DecodeAccessToken } from '../../../core/models/decode-access-token';


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

  platformId = inject(PLATFORM_ID)


  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });



    if (isPlatformBrowser(this.platformId)) { //!!! i dont love this solution - i need to use httpolycookies in my project

      // this.getUserNameAndEmail()

      if (this.cookieService.get('accessToken')) {
        let decodeAccessToken: DecodeAccessToken = jwtDecode(this.cookieService.get('accessToken'))
        if (decodeAccessToken) {
          this.userName.set(decodeAccessToken.firstName)
          this.userEmail.set(decodeAccessToken.email)
          this.lastName.set(decodeAccessToken.lastName)
        }
      }



    }


  }



  signOut() {
    this.authService.signOut()
  }



  // getUserNameAndEmail() {
  //   this.authService.getUserById().subscribe({
  //     next: (res) => {
  //       this.userEmail.set(res.email)
  //       console.log(this.userEmail());

  //       this.userName.set(res.firstName + ' ' + res.lastName)
  //       console.log(this.userName());

  //       console.log(res);

  //     },
  //     error: (err) => {
  //       console.log(err);

  //       if (err.error.errorMessage == 'jwt expired') {
  //         this.authService.generateAccessTokenByRefreshToken().subscribe({
  //           next: (res) => {
  //             this.cookieService.set("accessToken", res.data)
  //             console.log(res);

  //           },
  //           error: (err) => {
  //             this.authService.signOut()
  //           }
  //         })
  //       }

  //     }
  //   })
  // }


}
