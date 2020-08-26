import { Component, OnInit } from '@angular/core';
import { LoadExamplePlaylistsService } from '../services/load-example-playlists.service';
import { LoginSpotifyService } from '../services/spotify/login-spotify.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { IPlaylist } from '../shared-model/Playlist.model';
import { IcuPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';

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
  constructor(
    private examplePlaylistsService: LoadExamplePlaylistsService,
    private router: Router,
    private loginSpotifyService: LoginSpotifyService
  ) {}

  ngOnInit(): void {
    console.log('Connexion API...');
    this.subscription.add(
      this.loginSpotifyService.logToSpotifyAPI().subscribe(
        (data: any) => {
          console.log(data);
        },
        (err) => console.log(err)
      )
    );
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
          this.userPlaylists = data.playlists;
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
            this.categories = data.data.categories.items;
          }
        },
        (err) => console.log(err)
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
    this.subscription.add(
      this.loginSpotifyService.showCategoryPlaylists(categorie.id).subscribe(
        (data: any) => {
          if (data === undefined) {
          } else {
            this.categoryPlaylists = data.data.playlists.items;
          }
        },
        (err) => console.log(err)
      )
    );
  }
  onConnexion(): void {
    console.log('Connexion...');
    this.subscription.add(
      this.loginSpotifyService.logToSpotifyUSer().subscribe()
    );
  }
}
