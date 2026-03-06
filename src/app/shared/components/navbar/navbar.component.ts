import { AuthService } from './../../../core/services/api/auth.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})

export class NavbarComponent implements OnInit {

  constructor(private flowbiteService: FlowbiteService) { }
  private readonly cookieService = inject(CookieService)
  private readonly router: Router = inject(Router)
  private readonly toastrService: ToastrService = inject(ToastrService)
  @Input({ required: true }) isLogin!: boolean;
  private readonly authService: AuthService = inject(AuthService)


  ngOnInit(): void {

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

  }

  signOut() {
    this.authService.signOut()
  }
}
