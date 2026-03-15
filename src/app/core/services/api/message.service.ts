import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Messages } from '../../models/messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private http: HttpClient = inject(HttpClient)

  sendMessage(message: any, reseverId: any): Observable<any> {

    const body = {
      message: message
    }


    return this.http.post(environment.baseUrl + `/message/send-message/${reseverId}`, body)
  }


  getAllMessages(): Observable<Messages> {
    return this.http.get<Messages>(environment.baseUrl + `/message/get-all-messages`,)

  }


  getOneMessages(msgId: string | null): Observable<any> {
    if (msgId == null) {
      console.log('i am null in getonemessage in message service');
    }

    return this.http.get<any>(environment.baseUrl + `/message/get-one-messages/${msgId}`)

  }


  deleteMessages(msgId: string): Observable<any> {
    return this.http.delete<any>(environment.baseUrl + `/message/delete-messages/${msgId}`)
  }

}
