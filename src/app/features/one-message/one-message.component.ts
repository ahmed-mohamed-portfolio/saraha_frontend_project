import { isPlatformServer } from '@angular/common';
import { MessageService } from './../../core/services/api/message.service';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-one-message',
  imports: [],
  templateUrl: './one-message.component.html',
  styleUrl: './one-message.component.scss',
})
export class OneMessageComponent implements OnInit {

  private readonly messageService: MessageService = inject(MessageService)
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  private platformId = inject(PLATFORM_ID)
  private toastrService: ToastrService = inject(ToastrService)
  private router = inject(Router)
  message: WritableSignal<Message> = signal({} as Message)


  ngOnInit(): void {


    //!!! i need to change that
    if (isPlatformServer(this.platformId)) {
      return
    }

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

  getOneMessage(messageId: string) {
    this.messageService.getOneMessages(messageId).subscribe({
      next: (res) => {
        console.log(res);
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
        console.log(err);

      }
    })
  }
}
