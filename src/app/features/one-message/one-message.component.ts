import { AuthService } from './../../core/services/api/auth.service';
import { isPlatformServer } from '@angular/common';
import { MessageService } from './../../core/services/api/message.service';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { OneMessage } from '../../core/models/one-message';

@Component({
  selector: 'app-one-message',
  imports: [NavbarComponent],
  templateUrl: './one-message.component.html',
  styleUrl: './one-message.component.scss',
})
export class OneMessageComponent implements OnInit {

  private readonly messageService: MessageService = inject(MessageService)
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private platformId = inject(PLATFORM_ID)
  private toastrService: ToastrService = inject(ToastrService)
  private router = inject(Router)
  private authService: AuthService = inject(AuthService)
  message: WritableSignal<OneMessage> = signal({} as OneMessage)
  oneMessageReceverId: WritableSignal<string> = signal('')
  oneMessageReceverIdFromDecodeToken: WritableSignal<string> = signal('')
  flagAuth: WritableSignal<boolean> = signal(false)

  ngOnInit(): void {


    //!!! i need to change that
    if (isPlatformServer(this.platformId)) {
      return
    }

    this.getUserIdFromAccessToken()
    this.getMessageId()
  }

  getMessageId() {
    this.activatedRoute.paramMap.subscribe({
      next: (urlParams) => {
        let messageId = urlParams.get('msgId');

        if (messageId) {
          this.getOneMessage(messageId)
        }

      }
    })
  }


  getUserIdFromAccessToken() {
    const decoded = this.authService.decodeToken();

    console.log(decoded);

    if (decoded) {
      console.log(decoded.id);
      this.oneMessageReceverIdFromDecodeToken.set(decoded.id)
    }

  }


  getOneMessage(messageId: string) {
    this.messageService.getOneMessages(messageId).subscribe({
      next: (res) => {
        console.log("one message", res);

        this.oneMessageReceverId.set(res.data.receverId)

        if (this.oneMessageReceverIdFromDecodeToken() == this.oneMessageReceverId()) {
          this.flagAuth.set(true)
        }

        this.message.set(res)

      },
      error: (err) => {
        console.log(err);

      }
    })
  }



  removeMessage(msgId: string) {
    console.log("msgId", msgId);

    this.messageService.deleteMessages(msgId).subscribe({
      next: (res) => {
        console.log(res);
        this.toastrService.info("message removed successfully")
        this.router.navigate(["/messages"])

      },
      error: (err) => {
        console.log("from deleted one message", err);

      }
    })
  }
}
