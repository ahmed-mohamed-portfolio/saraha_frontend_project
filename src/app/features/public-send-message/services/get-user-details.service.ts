import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserDetails } from '../../../core/models/user-details'

@Injectable({
  providedIn: 'root',
})
export class GetUserDetailsService {

  private readonly http: HttpClient = inject(HttpClient)


  getUserDetailsByProfileName(profileName: string | null): Observable<UserDetails> {
    return this.http.get<UserDetails>(environment.baseUrl + `/auth/shared-user/${profileName}`)

  }

}
