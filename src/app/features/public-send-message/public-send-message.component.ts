import { GetUserDetailsService } from './services/get-user-details.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { CreateMessageComponent } from '../../shared/components/create-message/create-message.component';
import { DatePipe } from '@angular/common';
import { UserDetails } from '../../core/models/user-details';

@Component({
  selector: 'app-public-send-message',
  imports: [NavbarComponent, CreateMessageComponent, DatePipe],
  templateUrl: './public-send-message.component.html',
  styleUrl: './public-send-message.component.scss',
})
export class PublicSendMessageComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) { }
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly getUserDetailsService = inject(GetUserDetailsService)


  profileName: string | null = null
  userDetails: WritableSignal<UserDetails | null> = signal(null)
  id: WritableSignal<string> = signal('')
  ngOnInit(): void {

    this.getUserProfileName()
    this.getUserDetails()

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }


  getUserProfileName() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        this.profileName = urlParams.get('profileName');

      }
    })
  }


  getUserDetails() {

    this.getUserDetailsService.getUserDetailsByProfileName(this.profileName).subscribe({
      next: (res) => {
        if (res) {
          console.log("getUserDetailsByProfileName", res);
          this.id.set(res.data._id)
          this.userDetails.set(res)
        }

      },
      error: (err) => {
        console.log("from getUserDetailsByProfileName", err);

      }
    })
  }



}
