import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IPlaylist } from 'src/app/shared-model/Playlist.model';
import Player, { IPlayer } from 'src/app/shared-model/Player.model';
import Game, { IGame } from 'src/app/shared-model/Game.model';
import Message, { IMessage } from 'src/app/shared-model/Message.model';
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
import { AudioPlayerComponent } from 'src/app/shared/audio-player/audio-player.component';
import { MatDialog } from '@angular/material/dialog';
import { AddPseudoDialogComponent } from './../add-pseudo-dialog/add-pseudo-dialog.component';

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
  compteurTrack = 0;
  lecteurAudio: any;
  idCurrentPlaylist: any;
  src: string;
  autoplay: boolean;
  placeholder = 'Une idée du nom de la chanson ou de l\'artiste?';
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
  joueur: IPlayer;
  message: string;
  messages: IMessage[] = [];
  arePlayBtnDisabled: boolean;

  currentGame: IGame;

  @ViewChild('tryValue') tryValue: ElementRef;
  @ViewChild(AudioPlayerComponent) player: AudioPlayerComponent;

  constructor(
    private tryValueService: TryValueService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private builder: FormBuilder,
    public dialog: MatDialog,
    // private multiWS: MultiJoueurService,
    private socketService: WebSocketService
  ) {
    this.tryAnswer = new FormControl('', [Validators.required]);
    this.singlePlayForm = builder.group({ tryAnwser: this.tryAnswer });
  }

  async ngOnInit(): Promise<void> {
    this.getURLData();
    this.arePlayBtnDisabled = true;
    this.blMaitre =
      sessionStorage.getItem('master') === this.idCurrentGame ? true : false;
    if (this.blMaitre) {
      this.IsInit = true;
      this.partageLien = window.location.href;
      // todo recup game storage si existe déjà
      this.currentGame = new Game({
        idGame: this.idCurrentGame,
        idPlaylist: this.idCurrentPlaylist,
        players: [],
        currentSong: 0,
        pseudo: '',
      });
      sessionStorage.setItem(
        this.idCurrentGame,
        JSON.stringify(this.currentGame)
      );
    }



    this.openDialog();

  }

  getSocketGame(): void {
    const joueur = new Player({
      name: this.pseudo,
      score: 0,
      statut: this.blMaitre ? 'master' : 'guest',
      id: 1,
      currentSong: 0,
    });
    this.joueur = joueur;

    if (this.getJoueursByPseudo(this.pseudo) === null && this.blMaitre) {
      this.currentGame.players.push(joueur);
    }
    this.socketService.setupSocketConnection(
      this.pseudo + '/' + this.idCurrentPlaylist + '/' + this.idCurrentGame
    );

    document.title = this.pseudo + ' - Blindtest';
    sessionStorage.setItem('pseudo', this.pseudo);

    // Quand un nouveau joueur se connecte, on affiche l'information
    this.socketService.getMessages().subscribe((message: IMessage) => {
      this.addMessage(message);
    });

    this.socketService.getNouveauJoueur().subscribe((message: IMessage) => {
      message.isUserMessage = true;

      this.addMessage(message);
      if (!this.blMaitre) {
        return;
      }
      const playlist = JSON.parse(
        sessionStorage.getItem(this.idCurrentPlaylist)
      );
      const stringPlaylist = sessionStorage.getItem(this.idCurrentPlaylist);

      this.currentPlaylist = playlist;

      this.socketService.sendDataPlaylist(stringPlaylist);

      const joueur = new Player({
        name: message.message,
        score: 0,
        statut: 'invité',
        id: 55,
        currentSong: 0,
      });
      if (this.getJoueursByPseudo(this.pseudo)) {
        this.currentGame.players.push(joueur);
      }

      sessionStorage.setItem(
        this.idCurrentGame,
        JSON.stringify(this.currentGame)
      );
      this.socketService.sendJoueurs(JSON.stringify(this.currentGame));
    });

    this.socketService.getReussite().subscribe((gameData: any) => {
      this.currentGame = gameData;
      const MyMessage: IMessage = new Message();
      MyMessage.pseudo = '';
      MyMessage.message = this.currentGame.pseudo + ' a trouvé!';
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      this.addMessage(MyMessage);

      // Ajout maj session joueurs
      this.lecturePlaylist();
    });

    this.socketService.getNextSong().subscribe((gameData: any) => {
      this.currentGame = gameData;
      const MyMessage: IMessage = new Message();
      MyMessage.pseudo = '';
      MyMessage.message =
        this.currentGame.pseudo + ' a cliqué sur chanson suivante';
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      this.addMessage(MyMessage);

      // Ajout maj session joueurs
      this.lecturePlaylist();
    });



    this.socketService.getStart().subscribe((message: IMessage) => {
      message.isUserMessage = false;
      this.addMessage(message);
      this.arePlayBtnDisabled = false;
      this.currentGame.currentSong = 1;
      sessionStorage.setItem(this.currentGame.idGame, JSON.stringify(this.currentGame));
      this.jouerOnePlaylist();
    });
    // Non utilisé pour l'instant car fait planté node
    this.socketService.getDisconnect().subscribe((pseudo: string) => {
      const MyMessage: IMessage = new Message();
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      MyMessage.message = pseudo + ' a quitté la partie, bye!';
      MyMessage.pseudo = '';
      this.addMessage(MyMessage);

    });

    this.socketService.getPlay().subscribe((pseudo: any) => {
      const MyMessage: IMessage = new Message();
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      MyMessage.message = pseudo + ' a cliqué sur le bouton play/pause';
      MyMessage.pseudo = '';
      this.addMessage(MyMessage);
      if (pseudo === this.pseudo) {
        return;
      }
      this.player.doplayPause();
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

    this.socketService.getDataJoueurs().subscribe((dataGame: any) => {
      console.log(dataGame);
      if (this.blMaitre) {
        return;
      }
      this.currentGame = JSON.parse(dataGame);

      sessionStorage.setItem(this.currentGame.idGame, dataGame);
      this.compteurTrack = this.currentGame.currentSong;
      if (this.currentGame.currentSong > 0) {
        this.arePlayBtnDisabled = false;
      }
    });
  }
  // FIN NGONINIT

  openDialog() {

    this.pseudo = sessionStorage.getItem('pseudo');

    if (this.pseudo === null) {
      const dialogRef = this.dialog.open(AddPseudoDialogComponent, {
        width: '400px',
        data: 'Choisi ton pseudo :'
      });


      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.pseudo = result;
        this.getSocketGame();
      });
    } else {
      this.getSocketGame();
    }

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

  getJoueursByPseudo(pseudo: string): IPlayer {
    if (!this.currentGame) {
      return;
    }
    const result = this.currentGame.players.filter(
      (joueur) => joueur.name === pseudo
    )[0];
    if (result) {
      return result;
    } else {
      return null;
    }
  }
  sendMessage() {
    const myMessage = new Message();
    myMessage.message = this.message;
    myMessage.pseudo = this.pseudo;
    myMessage.isUserMessage = true;
    this.socketService.sendMessage(myMessage);
    this.addMessage(myMessage);
    this.message = '';
  }

  addMessage(message: any): void {
    const MyMessage: IMessage = new Message();
    MyMessage.message = message?.message || 'erreur';
    MyMessage.pseudo = message?.pseudo || 'erreur';
    MyMessage.id = 0;
    MyMessage.isUserMessage = message?.isUserMessage || false;

    this.messages.push(MyMessage);
  }
  commencerPartie() {
    this.IsInit = false;
    this.socketService.commencerPartie(this.pseudo);
    this.jouerOnePlaylist();
    this.arePlayBtnDisabled = false;
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
    this.resultat = '';
    this.singlePlayForm.reset();
    if (this.compteurTrack > 0) {
      this._snackBar.open(
        `C'était ${this.currentPlaylist.tracks[this.compteurTrack].name} de ${this.currentPlaylist.tracks[this.compteurTrack].artist
        }  `,
        'X',
        {
          duration: 2000,
        }
      );
    }
    this.compteurTrack++;
    this.currentGame.currentSong = this.compteurTrack;
    if (this.compteurTrack < this.currentPlaylist.tracks.length) {
      this.src = this.currentPlaylist.tracks[this.compteurTrack].preview_url;
      this.autoplay = true;
      // lecteurAudio.pause();
      this.playNextSong.emit();
      this.avancement =
        ' ' + this.compteurTrack + ' / ' + this.currentPlaylist.tracks.length;
    } else {
      this.avancement =
        ' ' + this.compteurTrack + ' / ' + this.currentPlaylist.tracks.length;
      this.src = null;
      this.autoplay = false;
      this.resultat =
        'La partie est finie! Bravo, votre score  est de ' + `${this.score}/20`;
      this.displayWinner();
    }
  }

  displayWinner(): void {
    this.currentGame?.players.filter((value) => value.score);
    const winner = this.currentGame?.players.sort(function (a, b) {
      const lastPlayer = a.score;
      const nextPlayer = b.score;
      return lastPlayer > nextPlayer ? -1 : 1;
    })[0];

    this._snackBar.open(
      `${winner.name} a gagné la partie avec une score de ${winner.score}/20!`
    );
    this.arePlayBtnDisabled = true;
  }

  playPausePressed(): void {
    console.log('Play Pause Pressed');
    // send playpausepressed, declenche click chez les autres
    this.socketService.sendPlay(this.pseudo);
  }
  onAudioEnded(): void {
    this.chansonSuivante();
  }

  chansonSuivante(): void {
    if (this.arePlayBtnDisabled) {
      return;
    }
    this.currentGame.pseudo = this.pseudo;
    this.socketService.sendChansonSuivant(this.currentGame);
    // this.lecturePlaylist();
  }

  checkAnswer(event, ValueToTry: string): void {
    if (this.arePlayBtnDisabled) {
      return;
    }
    let blResult: boolean;

    blResult = this.tryValueService.tryValue(
      ValueToTry,
      this.currentPlaylist.tracks[this.compteurTrack],
      false
    );

    if (blResult) {
      this.score++;
      this._snackBar.open(
        `Bravo, c'était ${this.currentPlaylist.tracks[this.compteurTrack].name
        } de ${this.currentPlaylist.tracks[this.compteurTrack].artist}  `,
        'X',
        {
          duration: 2000,
        }
      );
      // this.lecturePlaylist();
      this.currentGame.players.filter(
        (joueur) => joueur.name === this.pseudo
      )[0].score++;
      this.currentGame.pseudo = this.pseudo;
      this.socketService.sendReussite(this.currentGame);
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
