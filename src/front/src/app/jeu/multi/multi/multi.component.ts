import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IPlaylist } from 'src/app/shared-model/Playlist.model';
import Joueur, { IJoueur } from 'src/app/shared-model/Joueur.model';
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
  adresseActuelle: Location;
  adresseActuelleSplited: string[];
  IsInit = false;
  idCurrentGame: string;
  blMaitre: boolean;
  partageLien = '';
  tryAnswer: FormControl;
  singlePlayForm: FormGroup;
  pseudo: string;
  message: string;
  messages: any[] = [];
  joueurs: IJoueur[] = [];

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
    this.getURLData();

    this.blMaitre = sessionStorage.getItem(this.idCurrentGame) ? true : false;
    if (this.blMaitre) {
      this.IsInit = true;
      this.partageLien = window.location.href;
    }
    this.compteurTrack = 0;

    this.pseudo = sessionStorage.getItem('pseudo');
    if (this.pseudo === null) {
      this.pseudo = prompt('Quel est votre pseudo ?');
    }
    if (this.pseudo === null) {
      this.pseudo = 'joueur';
    }
    const joueur = new Joueur({
      name: this.pseudo,
      score: 0,
      statut: 'master',
      id: 1,
    });
    this.joueurs.push(joueur);
    this.socketService.setupSocketConnection(
      this.pseudo + '/' + this.idCurrentPlaylist + '/' + this.idCurrentGame
    );

    document.title = this.pseudo + ' - ' + document.title;
    sessionStorage.setItem('pseudo', this.pseudo);

    // Quand un nouveau joueur se connecte, on affiche l'information
    this.socketService.getMessages().subscribe((message: any) => {
      this.messages.push(message);
    });

    this.socketService.getNouveauJoueur().subscribe((message: any) => {
      this.messages.push(message);
      if (!this.blMaitre) {
        return;
      }
      const playlist = JSON.parse(
        sessionStorage.getItem(this.idCurrentPlaylist)
      );
      const stringPlaylist = sessionStorage.getItem(this.idCurrentPlaylist);

      this.currentPlaylist = playlist;

      this.socketService.sendDataPlaylist(stringPlaylist);

      const joueur = new Joueur({
        name: message.message,
        score: 0,
        statut: 'invité',
        id: 55,
      });

      this.joueurs.push(joueur);
      sessionStorage.setItem('joueurs', JSON.stringify(this.joueurs));
      this.socketService.sendJoueurs(JSON.stringify(this.joueurs));
    });

    this.socketService.getReussite().subscribe((joueurs: any) => {
      this.messages.push('bla');
      this.joueurs = joueurs;
      // Ajout maj session joueurs
      this.lecturePlaylist();
    });

    this.socketService.getStart().subscribe((message: any) => {
      this.messages.push(message);

      this.jouerOnePlaylist();
    });

    this.socketService.getDataPlaylist().subscribe((dataPlaylist: any) => {
      console.log(dataPlaylist);
      if (this.blMaitre) {
        return;
      }
      const playlistJson = dataPlaylist.dataPlaylist.JSON;

      sessionStorage.setItem(
        dataPlaylist.id.toString(),
        dataPlaylist.dataPlaylist
      );

      this.idCurrentPlaylist = dataPlaylist.id.toString();
      this.currentPlaylist = JSON.parse(dataPlaylist.dataPlaylist);
    });

    this.socketService.getDataJoueurs().subscribe((dataJoueurs: any) => {
      console.log(dataJoueurs);
      if (this.blMaitre) {
        return;
      }

      this.joueurs = JSON.parse(dataJoueurs);
      sessionStorage.setItem('joueurs', dataJoueurs);
    });
  }

  getURLData(): void {
    this.adresseActuelle = window.location;
    this.adresseActuelleSplited = this.adresseActuelle.pathname.split(';');
    const temp = this.adresseActuelleSplited[
      this.adresseActuelleSplited.length - 2
    ].split('=');
    const temp2 = this.adresseActuelleSplited[
      this.adresseActuelleSplited.length - 1
    ].split('=');

    this.idCurrentGame = temp2[1];
    this.idCurrentPlaylist = temp[1];
  }
  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }
  commencerPartie() {
    this.IsInit = false;
    this.socketService.commencerPartie(this.pseudo);
    this.jouerOnePlaylist();
  }

  jouerOnePlaylist(): void {
    const adresseActuelle = window.location;

    const words = adresseActuelle.pathname.split('=');

    // this.idCurrentPlaylist = words[words.length - 1];
    this.currentPlaylist = this.getPlaylistFromSessionStorage(
      this.idCurrentPlaylist
    );
    if (this.currentPlaylist === undefined) {
    }
    {
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
    // send playpausepressed, declenche click chez les autres
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
    this.socketService.sendChansonSuivant(this.joueurs);
    // this.lecturePlaylist();
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
      // this.lecturePlaylist();
      this.joueurs.filter(
        (joueur) => (joueur.name = this.pseudo)
      )[0].score += 1;
      this.socketService.sendChansonSuivant(this.joueurs);
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

  copyLink(): void {
    const el = document.createElement('textarea');
    el.value = this.partageLien;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this._snackBar.open('Le lien a été copié');
  }
}
