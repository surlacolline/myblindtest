import {
  Component,




  ElementRef, EventEmitter, OnInit,
  Output,

  ViewChild
} from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService2 } from 'src/app/services/cookie.service';
import { LoginSpotifyService } from 'src/app/services/spotify/login-spotify.service';
import { TryValueService } from './../../../services/try-value.service';
import { IPlaylist } from './../../../shared-model/Playlist.model';

@Component({
  selector: 'app-single',
  templateUrl: './single.component.html',
  styleUrls: ['./single.component.scss'],
})
export class SingleComponent implements OnInit {
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
  label = 'Une idée du nom de la chanson ou de l\'artiste?';
  placeholder = '';
  tryButtonTitle = 'Je me lance!';
  chansonSuivanteTitle = 'Aucune idée, Chanson suivante!';
  modeSoiree = false;
  tryAnswer: FormControl;
  singlePlayForm: FormGroup;

  @ViewChild('tryValue') tryValue: ElementRef;

  constructor(
    private tryValueService: TryValueService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private builder: FormBuilder,
    private cookieService: CookieService2,
    private spotifySerivce: LoginSpotifyService
  ) {
    this.tryAnswer = new FormControl('', [Validators.required]);
    this.singlePlayForm = builder.group({ tryAnwser: this.tryAnswer });
  }

  ngOnInit(): void {
    this.compteurTrack = -1;
    this.lecteurAudio = document.getElementById('lecteurAudio');
    this.jouerOnePlaylist();
    this.tryValue?.nativeElement.focus();
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
    let playlist = sessionStorage.getItem(id);

    this.currentPlaylist = JSON.parse(playlist);
    if (!playlist) {
      // if no playlist in sessionstorage, get playlist with id from url
      // todo 1 : id provenant de la première liste déroulante 
      // todo 2 : get API token if no token
      this.spotifySerivce.getPlaylist(id).subscribe((data: any) => {
        if (!data) {
          return;
        }
        const playlistResult: IPlaylist = JSON.parse(data.data);

        if (playlistResult.tracks.length >= 20) {
          sessionStorage.setItem(
            playlistResult.id.toString(),
            JSON.stringify(playlistResult)
          );
          playlist = sessionStorage.getItem(id);
        }

        if (!playlist) {
          return;
        }
        this.lecturePlaylist();
        return this.currentPlaylist;
      })

    } else {
      this.lecturePlaylist();
      return this.currentPlaylist;
    }

  }

  lecturePlaylist(): void {
    this.compteurTrack++;
    this.resultat = '';
    this.singlePlayForm.reset();

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
    this.tryValue?.nativeElement.focus();
  }

  playPausePressed(): void {
    console.log('Play Pause Pressed');
    this.tryValue?.nativeElement.focus();
  }
  onAudioEnded(): void {
    this.chansonSuivante();
  }

  chansonSuivante(): void {
    this._snackBar.open(
      `C'était ${this.currentPlaylist.tracks[this.compteurTrack].name} de ${this.currentPlaylist.tracks[this.compteurTrack].artist
      }  `,
      'X',
      {
        duration: 2000,
      }
    );
    this.lecturePlaylist();
  }

  checkAnswer(event, ValueToTry: string): void {
    console.log('test');
    let blResult: boolean;
    if (this.modeSoiree) {
      blResult = true;
    } else {
      blResult = this.tryValueService.tryValue(
        ValueToTry,
        this.currentPlaylist.tracks[this.compteurTrack],
        false
      );
    }

    if (blResult) {
      console.log('YES');
      this.score++;
      this._snackBar.open(
        `Bravo, c'était ${this.currentPlaylist.tracks[this.compteurTrack].name
        } de ${this.currentPlaylist.tracks[this.compteurTrack].artist}  `,
        'X',
        {
          duration: 2000,
        }
      );
      this.lecturePlaylist();
    } else {
      this._snackBar.open('Nope, try again... ', 'X', {
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
      this.label = '';
      this.tryButtonTitle = `J'ai la bonne réponse!`;
      this.chansonSuivanteTitle = 'Raté !';
    } else {
      this.label = 'Une idée du nom de la chanson ou de l\'artiste?';
      this.placeholder = ``;
      this.tryButtonTitle = 'Je me lance!';
      this.chansonSuivanteTitle = 'Aucune idée, chanson suivante';
    }
  }
  showResult(): void {
    if (!this.modeSoiree) {
      return;
    } else if (this.tryValue.nativeElement.value.indexOf('C\'est ') != -1) {
      this.tryValue.nativeElement.value = '';
    } else {
      const nom = this.currentPlaylist.tracks[this.compteurTrack].name;
      const titre = this.currentPlaylist.tracks[this.compteurTrack].artist;

      const result = `C'est ${nom} de ${titre}`;
      this.tryValue.nativeElement.value = result;
    }
  }
}
