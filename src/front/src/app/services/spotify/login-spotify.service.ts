import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSpotifyService {
  paginationCategories = 0;
  constructor(private http: HttpClient) {}

  logToSpotifyUSer(): Observable<any> {
    //
    const optionRequete = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
      }),
    };

    const httpOptions = {
      headers: { 'Access-Control-Allow-Origin': '*' },
      withCredentials: true,
    };

    return this.http.get<string>('/api/spotify/login', httpOptions);
  }

  logToSpotifyAPI(): Observable<any> {
    //

    return this.http.get<string>('/api/spotify/APILogin', {
      withCredentials: true,
    });
  }

  showSpotifyCategories(e, blAfficherPlus): Observable<any> {
    return this.http.get<string>('/api/spotify/categories');
  }

  showCategoryPlaylists(id): Observable<any> {
    const myparams = new HttpParams().set('idCategory', id);
    return this.http.get<string>('/api/spotify/categoryPlaylists', {
      params: myparams,
    });
  }
}
