import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSpotifyService {
  paginationCategories = 0;
  constructor(private http: HttpClient) {}

  showSpotifyCategories(e, blAfficherPlus): Observable<any> {
    return this.http.get<string>('/api/spotify/categories');
  }

  showCategoryPlaylists(id): Observable<any> {
    const myparams = new HttpParams().set('idCategory', id);
    return this.http.get<string>('/api/spotify/categoryPlaylists', {
      params: myparams,
    });
  }

  getPlaylist(id): Observable<any> {
    const myparams = new HttpParams().set('idPlaylist', id);
    return this.http.get<string>('/api/spotify//playlistAPI', {
      params: myparams,
    });
  }
}
