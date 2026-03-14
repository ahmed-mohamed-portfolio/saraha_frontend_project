import { isPlatformServer } from '@angular/common';
import { MessageService } from './../../core/services/api/message.service';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-one-message',
  imports: [],
  templateUrl: './one-message.component.html',
  styleUrl: './one-message.component.scss',
})
export class OneMessageComponent implements OnInit {

  private readonly messageService: MessageService = inject(MessageService)
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  message: WritableSignal<Message> = signal({} as Message)
  private platformId = inject(PLATFORM_ID)

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
}
