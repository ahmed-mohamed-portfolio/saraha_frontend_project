import { AfterViewInit, Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService } from '../../core/services/api/message.service';
import { Messages } from '../../core/models/messages';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent {

  private readonly messageService: MessageService = inject(MessageService)

  messages: WritableSignal<Messages> = signal({} as Messages);


  ngAfterViewInit(): void {
    this.getAllMessages()

  }



  getAllMessages() {
    this.messageService.getAllMessages().subscribe({
      next: (res) => {

        this.messages.set(res)
        console.log(res);
      },
      error: (err) => {
        console.log(err);

      }

    })
  }

}
