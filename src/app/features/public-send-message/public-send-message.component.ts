import { GetUserDetailsService } from './services/get-user-details.service';
import { Component, inject, OnInit } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { CreateMessageComponent } from '../../shared/components/create-message/create-message.component';

@Component({
  selector: 'app-public-send-message',
  imports: [NavbarComponent, CreateMessageComponent],
  templateUrl: './public-send-message.component.html',
  styleUrl: './public-send-message.component.scss',
})
export class PublicSendMessageComponent implements OnInit {
  constructor(private flowbiteService: FlowbiteService) { }
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly getUserDetailsService = inject(GetUserDetailsService)


  id: string | null = null
  userDetails: UserDetails | null = null

  ngOnInit(): void {

    this.getUserId()
    this.getUserDetails()

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }


  getUserId() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        this.id = urlParams.get('id');

      }
    })
  }


  getUserDetails() {

    this.getUserDetailsService.getUserDetails(this.id).subscribe({
      next: (res) => {
        if (res) {
          this.userDetails = res
        }

      },
      error: (err) => {
        console.log(err);

      }
    })
  }



}
