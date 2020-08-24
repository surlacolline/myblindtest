import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSpotifyService {
  constructor(private http: HttpClient) {}

  logToSpotifyUSer(): Observable<any> {
    //

    return this.http.get<string>('/api/spotify/login');
  }

  logToSpotifyAPI(): Observable<any> {
    //

    return this.http.get<string>('/api/spotify/APILogin');
  }
}
