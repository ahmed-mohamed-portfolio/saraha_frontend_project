import { AuthService } from './../../core/services/api/auth.service';
import { AfterViewInit, Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { MessageService } from '../../core/services/api/message.service';
import { Messages } from '../../core/models/messages';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {

  private readonly messageService: MessageService = inject(MessageService)

  messages: WritableSignal<Messages> = signal({} as Messages);

  private platformId = inject(PLATFORM_ID)



  ngOnInit(): void {
    //!!! i need to change that
    if (isPlatformServer(this.platformId)) {
      return
    }


    this.getAllMessages()

  }

  private authService: AuthService = inject(AuthService)
  private cookieService: CookieService = inject(CookieService)

  getAllMessages() {
    this.messageService.getAllMessages().subscribe({
      next: (res) => {

        this.messages.set(res)
      },
      error: (err) => {
        //!!!i need some oone check this after me - no one teach me that - that may get bad behaviour
        if (err.error.errorMessage === 'jwt expired') {

          this.authService.generateAccessTokenByRefreshToken().subscribe({
            next: (res) => {

              this.cookieService.set("accessToken", res.data)
              this.getAllMessages()
            }, error: (err) => {
              console.log(err);

            }
          })
        }

        console.log(err);

      }

    })
  }

}
