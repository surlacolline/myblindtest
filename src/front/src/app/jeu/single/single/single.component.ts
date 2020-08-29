import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ChoixPlaylistComponent } from 'src/app/choix-playlist/choix-playlist.component';
import { IPlaylist } from './../../../shared-model/Playlist.model';
import { TryValueService } from './../../../services/try-value.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
  constructor(
    private tryValueService: TryValueService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  @Output() playNextSong = new EventEmitter();

  resultat: string;
  score = 0;

  avancement: string;
  currentPlaylist: IPlaylist;
  compteurTrack: number;
  lecteurAudio: any;
  idCurrentPlaylist: any;
  src: string;
  autoplay: boolean;
  placeholder = "Une idée du nom de la chanson ou de l'artiste?";
  tryButtonTitle = 'Je me lance!';
  modeSoiree = false;

  @ViewChild('tryValue') tryValue: ElementRef;

  ngOnInit(): void {
    this.compteurTrack = 0;
    this.lecteurAudio = document.getElementById('lecteurAudio');
    this.jouerOnePlaylist();
  }

  jouerOnePlaylist(): void {
    const adresseActuelle = window.location;

    const words = adresseActuelle.pathname.split('=');

    this.idCurrentPlaylist = words[words.length - 1];
    this.currentPlaylist = this.getPlaylistFromSessionStorage(
      this.idCurrentPlaylist
    );
    if (this.currentPlaylist === undefined) {
      // this.currentPlaylist = getPlaylistFromId(idCurrentPlaylist);
    }
  }

  getPlaylistFromSessionStorage(id): IPlaylist {
    const playlist = JSON.parse(sessionStorage.getItem(id));

    this.currentPlaylist = playlist;
    if (!playlist) {
      return;
    }
    this.lecturePlaylist();
    return playlist;
  }

  lecturePlaylist(): void {
    this.compteurTrack++;
    this.resultat = '';

    if (this.compteurTrack < this.currentPlaylist.tracks.length) {
      this.src = this.currentPlaylist.tracks[this.compteurTrack].preview_url;
      this.autoplay = true;
      // lecteurAudio.pause();
      this.playNextSong.emit();
      this.avancement =
        ' ' + this.compteurTrack + ' / ' + this.currentPlaylist.tracks.length;
    } else {
      this.src = null;
      this.autoplay = false;
      this.resultat =
        'La partie est finie! Bravo, votre score  est de ' + `${this.score}/20`;
    }
  }

  playPausePressed(): void {
    console.log('Play Pause Pressed');
  }
  onAudioEnded(): void {
    this._snackBar.open(
      `C'était ${this.currentPlaylist.tracks[this.compteurTrack].name} de ${
        this.currentPlaylist.tracks[this.compteurTrack].artist
      }  `,
      'X',
      {
        duration: 2000,
      }
    );
    this.lecturePlaylist();
  }

  chansonSuivante(): void {
    this.lecturePlaylist();
  }

  methodtryValue(event, ValueToTry: string): void {
    console.log('test');
    const blResult: boolean = this.tryValueService.tryValue(
      ValueToTry,
      this.currentPlaylist.tracks[this.compteurTrack],
      false
    );
    if (blResult) {
      console.log('YES');
      this.score++;
      this._snackBar.open(
        `Bravo, c'était ${
          this.currentPlaylist.tracks[this.compteurTrack].name
        } de ${this.currentPlaylist.tracks[this.compteurTrack].artist}  `,
        'X',
        {
          duration: 2000,
        }
      );
      this.lecturePlaylist();
    } else {
      this._snackBar.open('Nope, try again.., ', 'X', {
        duration: 2000,
      });
      console.log('faux');
    }
  }

  RetourChoixPlaylist(): void {
    this.router.navigate(['/choix-playlist']);
  }

  modeSoireeOnOff(event): void {
    this.modeSoiree = !this.modeSoiree;
    console.log(this.modeSoiree);
    if (this.modeSoiree) {
      this.placeholder = `Clique ici pour voir la réponse`;
      this.tryButtonTitle = `J'ai la bonne réponse!`;
    } else {
      this.placeholder = "Une idée du nom de la chanson ou de l'artiste?";
      this.tryButtonTitle = 'Je me lance!';
    }
  }
  showResult(): void {
    if (!this.modeSoiree) {
      return;
    } else if (this.tryValue.nativeElement.value.indexOf("C'est ") != -1) {
      this.tryValue.nativeElement.value = '';
    } else {
      const nom = this.currentPlaylist.tracks[this.compteurTrack].name;
      const titre = this.currentPlaylist.tracks[this.compteurTrack].artist;

      const result = `C'est ${nom} de ${titre}`;
      this.tryValue.nativeElement.value = result;
    }
  }
}
