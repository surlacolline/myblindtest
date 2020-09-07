import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IPlaylist } from 'src/app/shared-model/Playlist.model';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TryValueService } from 'src/app/services/try-value.service';
import { MultiJoueurService } from 'src/app/services/multi-joueur.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-multi',
  templateUrl: './multi.component.html',
  styleUrls: ['./multi.component.scss'],
})
export class MultiComponent implements OnInit {
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
  chansonSuivanteTitle = 'Aucune idée , Chanson suivante!';
  adresseActuelle = window.location;
  adresseActuelleSplited = this.adresseActuelle.pathname.split('=');
  IsInit = false;

  idCurrentGame: string;
  blMaitre: boolean;
  partageLien = '';

  tryAnswer: FormControl;
  singlePlayForm: FormGroup;
  pseudo: string;

  @ViewChild('tryValue') tryValue: ElementRef;

  constructor(
    private tryValueService: TryValueService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private builder: FormBuilder,
    // private multiWS: MultiJoueurService,
    private socketService: WebSocketService
  ) {
    this.tryAnswer = new FormControl('', [Validators.required]);
    this.singlePlayForm = builder.group({ tryAnwser: this.tryAnswer });
  }

  ngOnInit(): void {
    this.idCurrentGame = this.adresseActuelleSplited[
      this.adresseActuelleSplited.length - 1
    ];
    this.blMaitre = sessionStorage.getItem(this.idCurrentGame) ? true : false;
    if (this.blMaitre) {
      this.IsInit = true;
      this.partageLien = window.location.pathname;
    }
    this.compteurTrack = 0;

    // this.multiWS.messages.subscribe((msg) => {
    //   console.log(msg);
    // });

    this.pseudo = prompt('Quel est votre pseudo ?');
    if (this.pseudo === null) {
      this.pseudo = 'joueur';
    }
    this.socketService.setupSocketConnection(
      this.pseudo + '/' + this.idCurrentPlaylist + '/' + this.idCurrentGame
    );

    document.title = this.pseudo + ' - ' + document.title;
    sessionStorage.setItem('pseudo', this.pseudo);
  }

  sendMessage() {
    // this.multiWS.sendMsg('Test Message');
  }
  commencerPartie() {
    this.IsInit = false;
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
  }

  playPausePressed(): void {
    console.log('Play Pause Pressed');
  }
  onAudioEnded(): void {
    this.chansonSuivante();
  }

  chansonSuivante(): void {
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

  checkAnswer(event, ValueToTry: string): void {
    console.log('test');
    let blResult: boolean;

    blResult = this.tryValueService.tryValue(
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
      this._snackBar.open('Nope, try again... ', 'X', {
        duration: 2000,
      });
      console.log('faux');
    }
  }

  RetourChoixPlaylist(): void {
    this.router.navigate(['/choix-playlist']);
  }
}
