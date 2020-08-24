import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
