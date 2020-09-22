import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginSpotifyService {
  paginationCategories = 0;
  constructor(private http: HttpClient) {}

  showSpotifyCategories(startIndex: number): Observable<any> {
    //
    const myparams = new HttpParams().set('startIndex', startIndex.toString());
    return this.http.get<string>('/api/spotify/categories', {
      params: myparams,
    });
  }

  showCategoryPlaylists(id, offset = 0): Observable<any> {
    const myparams = new HttpParams()
      .set('idCategory', id)
      .set('startIndex', offset.toString());
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
