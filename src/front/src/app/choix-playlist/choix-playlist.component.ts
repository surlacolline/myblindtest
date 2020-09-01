import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoadExamplePlaylistsService } from '../services/load-example-playlists.service';
import { LoginSpotifyService } from '../services/spotify/login-spotify.service';

import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IPlaylist } from '../shared-model/Playlist.model';

@Component({
  selector: 'app-choix-playlist',
  templateUrl: './choix-playlist.component.html',
  styleUrls: ['./choix-playlist.component.scss'],
})
export class ChoixPlaylistComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  playlists: IPlaylist[];
  userPlaylists: IPlaylist[];
  categories: any[];
  categoryPlaylists: IPlaylist[];
  showCategoryPlaylists = false;
  titleCategorie: string;
  userName: string;
  @ViewChild('connexionButtonAPI') connexionButtonAPI: ElementRef;
  @ViewChild('connexionButton') connexionButton: ElementRef;
  constructor(
    private examplePlaylistsService: LoadExamplePlaylistsService,
    private router: Router,
    private loginSpotifyService: LoginSpotifyService
  ) {}

  ngOnInit(): void {
    this.userName = this.getCookie('display_name') || 'connexion';
  }

  getCookie(name): string {
    if (document.cookie.length === 0) {
      return null;
    }

    const regSepCookie = new RegExp('(; )', 'g');
    const cookies = document.cookie.split(regSepCookie);

    for (let i = 0; i < cookies.length; i++) {
      const regInfo = new RegExp('=', 'g');
      const infos = cookies[i].split(regInfo);
      if (infos[0] == name) {
        return unescape(infos[1]);
      }
    }
    return null;
  }

  displayPlaylists(): void {
    this.subscription.add(
      this.examplePlaylistsService.getAllPlaylists().subscribe(
        (data: any) => {
          this.playlists = data.playlists;
        },
        (err) => console.log(err)
      )
    );
  }

  displayUserPlaylists(): void {
    this.subscription.add(
      this.examplePlaylistsService.getAllUserPlaylists().subscribe(
        (data: any) => {
          if (data.data.items === undefined) {
            this.userName = 'connexion';
          } else {
            this.userPlaylists = data.data.items;
          }
        },
        (err) => console.log(err)
      )
    );
  }

  displayCategories(): void {
    this.subscription.add(
      this.loginSpotifyService.showSpotifyCategories(null, false).subscribe(
        (data: any) => {
          if (data === undefined) {
          } else {
            if (data.data.categories === undefined) {
              this.connexionButtonAPI.nativeElement.click();
            } else {
              this.categories = data.data.categories.items;
            }
          }
        },
        (err) => {
          console.log(err);
          this.connexionButton.nativeElement.click();
          this.displayCategories();
        }
      )
    );
  }
  playlistSelected(playlist: any): void {
    console.log(playlist.name);
    const playlistJson = playlist;
    sessionStorage.setItem(
      playlistJson.id.toString(),
      JSON.stringify(playlistJson)
    );

    this.router.navigate(['/jeu-single', { id: playlist.id }]);
  }

  playlistSelectedAPI(playlist: any): void {
    console.log(playlist.name);
    const playlistJson = playlist;

    this.subscription.add(
      this.loginSpotifyService
        .getPlaylist(playlist.id)
        .subscribe((data: any) => {
          if (data === undefined) {
          } else {
            const playlistAPI = data.data;
            this.playlistSelected(JSON.parse(playlistAPI));
          }
        })
    );
  }
  categoriesSelected(categorie: any): void {
    console.log(categorie.name);
    this.titleCategorie = `Chosis une playlist de la catégorie ${categorie.name}`;
    this.subscription.add(
      this.loginSpotifyService.showCategoryPlaylists(categorie.id).subscribe(
        (data: any) => {
          if (data === undefined) {
          } else {
            this.categoryPlaylists = data.data.playlists.items;
            this.showCategoryPlaylists = true;
          }
        },
        (err) => console.log(err)
      )
    );
  }
  onConnexion(): void {
    console.log('Connexion...');
  }
}
