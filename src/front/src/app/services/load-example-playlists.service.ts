import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadExamplePlaylistsService {
  constructor(private http: HttpClient) {}

  getAllPlaylists(): Observable<string> {
    //

    return this.http.get<string>('/api/playlists/all');
  }
  getAllUserPlaylists(startIndex: number): Observable<any> {
    //
    const myparams = new HttpParams().set('startIndex', startIndex.toString());

    return this.http.get('/api/spotify/playlists', { params: myparams });
  }

  getNextUserPlaylists(): Observable<string> {
    //

    return this.http.get<string>('/api/spotify/playlists');
  }

  // .then((response) => {
  //   this.allPlaylists = response.playlists;

  //   let html = '';
  //   for (const playlist of this.allPlaylists) {
  //     html += `
  //     <li  class='cursor-pointer' onclick="jouerOnePlaylist('${playlist.id}')">
  //       <a>${playlist.name}</a>
  //     </li> `;
  //     // <button onclick=\"deleteOnePlaylist('" +
  //     // playlist.id +
  //     // "')\">  Supprimer </button>"
  //   }

  //   html = `<ul>${html}</ul>`;
  //   return html;
  // })
  // .then((html) => html);
}
