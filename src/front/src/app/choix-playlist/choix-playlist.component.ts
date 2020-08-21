import { Component, OnInit } from '@angular/core';
import { LoadExamplePlaylistsService } from '../services/load-example-playlists.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-choix-playlist',
  templateUrl: './choix-playlist.component.html',
  styleUrls: ['./choix-playlist.component.scss'],
})
export class ChoixPlaylistComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  playlists: any[];
  constructor(private examplePlaylistsService: LoadExamplePlaylistsService) {}

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
    console.log(playlist.title);
  }
}
