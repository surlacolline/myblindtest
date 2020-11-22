import { Component, OnInit, ElementRef, ViewChild, AfterContentInit, AfterContentChecked, AfterViewInit } from '@angular/core';
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
export class ChoixPlaylistComponent implements OnInit, AfterViewInit {
  private subscription: Subscription = new Subscription();
  playlists: IPlaylist[];
  userPlaylists: IPlaylist[];
  categories: any[];
  categoryPlaylists: IPlaylist[];
  showCategoryPlaylists = false;
  showUserPlaylists = false;
  titleCategorie: string;
  userName: string;
  offsetUserPlaylists: number;
  totalCountUserPlaylists: number;
  offsetCategories: number;
  totalCountCategories: number;
  offsetCategoryPlaylists: number;
  totalCountCategoryPlaylists: number;
  selectedCategoryID: number;
  isMoreButtonVisible: boolean;
  isCategoriesInit = false;
  @ViewChild('connexionButtonAPI') connexionButtonAPI: ElementRef;

  constructor(
    private examplePlaylistsService: LoadExamplePlaylistsService,
    private router: Router,
    private loginSpotifyService: LoginSpotifyService,
    private cookieService: CookieService
  ) { }

  ngAfterViewInit(): void {
    if (!this.isCategoriesInit && this.connexionButtonAPI) {
      this.connexionButtonAPI?.nativeElement?.click();
    }
  }

  ngOnInit(): void {
    this.userName = this.cookieService.getCookie('display_name') || 'Connexion';
    this.isCategoriesInit = this.cookieService.getCookie('tokenAPI') ? true : false;
  }



  displayPlaylists(): void {
    if (!this.isCategoriesInit) {
      this.connexionButtonAPI?.nativeElement?.click();
    }
    if (this.playlists) {
      return;
    }
    this.subscription.add(
      this.examplePlaylistsService.getAllPlaylists().subscribe(
        (data: any) => {
          this.playlists = data.playlists;
          this.isMoreButtonVisible = false;
        },
        (err) => console.log(err)
      )
    );
  }

  displayUserPlaylists(element, offset = 0): void {
    this.subscription.add(
      this.examplePlaylistsService.getAllUserPlaylists(offset).subscribe(
        (data: any) => {
          if (data.data.items === undefined) {
            this.userName = 'Connexion';
            // todo supprimer cookie

            alert('Veuillez d\'abord vous connecter à votre compte spotify');
            this.showUserPlaylists = false;
            element.close();
          } else {
            this.userPlaylists = data.data.items;
            this.offsetUserPlaylists = data.data.offset;
            this.totalCountUserPlaylists = data.data.total;
          }
        },
        (err) => console.log(err)
      )
    );
  }


  displayCategories(offset = 0): void {
    if (!this.isCategoriesInit) {
      this.connexionButtonAPI?.nativeElement?.click();
      this.isCategoriesInit = true;
    }
    if (this.categories && offset <= this.offsetCategories) {
      return;
    }

    if (offset >= this.totalCountCategories) {
      offset = 0;
    }

    this.subscription.add(
      this.loginSpotifyService.showSpotifyCategories(offset).subscribe(
        (data: any) => {
          if (data === undefined) {
          } else {
            if (data.data.categories === undefined) {
              // this.connexionButtonAPI.nativeElement.click();
            } else {
              this.categories = data.data.categories.items;
              this.offsetCategories = data.data.categories.offset;
              this.totalCountCategories = data.data.categories.total;
              this.offsetCategories < this.totalCountCategories
                ? (this.isMoreButtonVisible = true)
                : (this.isMoreButtonVisible = false);
            }
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }
  playlistSelected(params: any): void {
    const playlist: any = params.item;
    debugger;
    const isMulti: boolean = params.isMulti;
    console.log(playlist.name);
    const playlistJson = playlist;
    sessionStorage.setItem(
      playlistJson.id.toString(),
      JSON.stringify(playlistJson)
    );
    if (isMulti) {
      const code = this.generateRandomString(5);
      sessionStorage.setItem('master', code.toString());
      this.router.navigate(['/jeu-multi', { id: playlist.id, code }]);
    } else {
      this.router.navigate(['/jeu-single', { id: playlist.id }]);
    }
  }

  generateRandomString = (length) => {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  playlistSelectedAPI(params): void {
    const playlist: any = params.item;
    const isMulti: boolean = params.isMulti;
    console.log(playlist.name);
    const playlistJson = playlist;

    this.subscription.add(
      this.loginSpotifyService
        .getPlaylist(playlist.id)
        .subscribe((data: any) => {
          if (data === undefined) {
          } else {
            const playlistAPI = data.data;
            this.playlistSelected({ item: JSON.parse(playlistAPI), isMulti });
          }
        })
    );
  }
  categoriesSelected(event: any): void {
    this.showCategoryPlaylists = false;
    const categorie = event.item;
    console.log(categorie.name);
    this.selectedCategoryID = categorie.id;
    this.titleCategorie = `Chosis une playlist de la catégorie ${categorie.name}`;
    this.subscription.add(
      this.loginSpotifyService.showCategoryPlaylists(categorie.id).subscribe(
        (data: any) => {
          if (data === undefined) {
          } else {
            this.categoryPlaylists = data.data.playlists.items;
            this.showCategoryPlaylists = true;
            this.offsetCategoryPlaylists = data.data.playlists.offset;
            this.totalCountCategoryPlaylists = data.data.playlists.total;
          }
        },
        (err) => console.log(err)
      )
    );
  }
  showNextCategoryPlaylists(event: any): void {
    this.offsetCategoryPlaylists = this.offsetCategoryPlaylists + 50;
    if (this.offsetCategoryPlaylists >= this.totalCountCategoryPlaylists) {
      this.offsetCategoryPlaylists = 0;
    }
    this.subscription.add(
      this.loginSpotifyService
        .showCategoryPlaylists(
          this.selectedCategoryID,
          this.offsetCategoryPlaylists
        )
        .subscribe(
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

  showNextUserPlaylists(element): void {
    const offset = this.offsetUserPlaylists + 50;
    if (offset < this.totalCountUserPlaylists) {
      this.displayUserPlaylists(element, offset);
    }
  }
  showBeforeUserPlaylists(element): void {
    let offset = 0;
    if (this.offsetUserPlaylists >= 50) {
      offset = this.offsetUserPlaylists - 50;
      this.displayUserPlaylists(element, offset);
    }
  }
  showNextCategories(): void {
    this.displayCategories(this.offsetCategories + 50);
  }
  onConnexion(): void {
    console.log('Connexion...');
  }
}
