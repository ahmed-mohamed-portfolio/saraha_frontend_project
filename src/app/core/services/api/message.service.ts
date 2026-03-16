import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Messages } from '../../models/messages';
import { OneMessage } from '../../models/one-message';
import { DeletedMessageRes } from '../../models/deleted-message-res';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private http: HttpClient = inject(HttpClient)

  sendMessage(message: any, reseverId: any): Observable<any> {//* let message: any till i upload photo

    const body = {
      message: message
    }


    return this.http.post(environment.baseUrl + `/message/send-message/${reseverId}`, body)
  }


  getAllMessages(): Observable<Messages> {
    return this.http.get<Messages>(environment.baseUrl + `/message/get-all-messages`,)

  }


  getOneMessages(msgId: string | null): Observable<OneMessage> {
    if (msgId == null) {
      console.log('i am null in getonemessage in message service');
    }

    return this.http.get<OneMessage>(environment.baseUrl + `/message/get-one-messages/${msgId}`)

  }


  deleteMessages(msgId: string): Observable<DeletedMessageRes> {
    return this.http.delete<DeletedMessageRes>(environment.baseUrl + `/message/delete-messages/${msgId}`)
  }

}
