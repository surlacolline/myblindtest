import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoadExamplePlaylistsService } from '../services/load-example-playlists.service';
import { LoginSpotifyService } from '../services/spotify/login-spotify.service';
import { CookieService } from '../services/cookie.service';

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
  showUserPlaylists = false;
  titleCategorie: string;
  userName: string;
  @ViewChild('connexionButtonAPI') connexionButtonAPI: ElementRef;
  @ViewChild('connexionButton') connexionButton: ElementRef;
  constructor(
    private examplePlaylistsService: LoadExamplePlaylistsService,
    private router: Router,
    private loginSpotifyService: LoginSpotifyService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.userName = this.cookieService.getCookie('display_name') || 'connexion';
  }

  displayPlaylists(): void {
    if (this.playlists) {
      return;
    }
    this.subscription.add(
      this.examplePlaylistsService.getAllPlaylists().subscribe(
        (data: any) => {
          this.playlists = data.playlists;
        },
        (err) => console.log(err)
      )
    );
  }

  displayUserPlaylists(element): void {
    if (this.userPlaylists) {
      return;
    }

    this.subscription.add(
      this.examplePlaylistsService.getAllUserPlaylists().subscribe(
        (data: any) => {
          if (data.data.items === undefined) {
            this.userName = 'connexion';
            // todo supprimer cookie

            alert("Veuillez d'abord vous connecter à votre compte spotify");
            this.showUserPlaylists = false;
            element.close();
          } else {
            this.userPlaylists = data.data.items;
          }
        },
        (err) => console.log(err)
      )
    );
  }
  // closeUserPlaylists() {
  //   if (!this.userPlaylists) {
  //     this.showUserPlaylists = false;
  //   }
  // }

  displayCategories(): void {
    if (this.categories) {
      return;
    }
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
