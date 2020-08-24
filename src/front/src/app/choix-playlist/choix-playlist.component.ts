import { Component, OnInit } from '@angular/core';
import { LoadExamplePlaylistsService } from '../services/load-example-playlists.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choix-playlist',
  templateUrl: './choix-playlist.component.html',
  styleUrls: ['./choix-playlist.component.scss'],
})
export class ChoixPlaylistComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  playlists: any[];
  constructor(
    private examplePlaylistsService: LoadExamplePlaylistsService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  displayPlaylist(): void {
    this.subscription.add(
      this.examplePlaylistsService.getAllPlaylists().subscribe(
        (data: any) => {
          this.playlists = data.playlists;
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
}
