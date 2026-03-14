import { AuthService } from './../../core/services/api/auth.service';
import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { MessageService } from '../../core/services/api/message.service';
import { Messages } from '../../core/models/messages';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformServer } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {

  private readonly messageService: MessageService = inject(MessageService)
  private platformId = inject(PLATFORM_ID)
  private authService: AuthService = inject(AuthService)
  private cookieService: CookieService = inject(CookieService)
  private toastrService: ToastrService = inject(ToastrService)
  messages: WritableSignal<Messages> = signal({} as Messages);


  ngOnInit(): void {

    //!!! i need to change that
    if (isPlatformServer(this.platformId)) {
      return
    }


    this.getAllMessages()

  }



  copyLink(id: string) {

    navigator.clipboard.writeText(`${environment.frontUrl}/oneMesssage/${id}`);
    this.toastrService.info("you can past link in any browser", "message url coped")
  }



  getAllMessages() {
    this.messageService.getAllMessages().subscribe({
      next: (res) => {

        this.messages.set(res)
      },
      error: (err) => {

        console.log(err);

      }

    })
  }

}
