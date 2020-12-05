import {
  Component,




  ElementRef, OnInit,


  ViewChild
} from '@angular/core';
import {
  FormBuilder, FormControl,
  FormGroup,

  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CookieService2 } from 'src/app/services/cookie.service';
import { TryValueService } from 'src/app/services/try-value.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Game, { IGame } from 'src/app/shared-model/Game.model';
import Message, { IMessage } from 'src/app/shared-model/Message.model';
import Player, { IPlayer, IPlayerIdentity } from 'src/app/shared-model/Player.model';
import { IPlaylist } from 'src/app/shared-model/Playlist.model';
import { AudioPlayerComponent } from 'src/app/shared/audio-player/audio-player.component';
import { AddPseudoDialogComponent } from './../add-pseudo-dialog/add-pseudo-dialog.component';


@Component({
  selector: 'app-multi',
  templateUrl: './multi.component.html',
  styleUrls: ['./multi.component.scss'],
})
export class MultiComponent implements OnInit {
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
  playerIdentity: IPlayerIdentity = { id: 0, pseudo: '' };
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
    private snackBar: MatSnackBar,
    private builder: FormBuilder,
    public dialog: MatDialog,
    // private multiWS: MultiJoueurService,
    private socketService: WebSocketService,
    private cookieService: CookieService2
  ) {
    this.tryAnswer = new FormControl('', [Validators.required]);
    this.singlePlayForm = builder.group({ tryAnwser: this.tryAnswer });
  }

  async ngOnInit(): Promise<void> {
    this.getURLData();
    this.arePlayBtnDisabled = true;

    this.blMaitre =
      this.cookieService.get('master') === this.idCurrentGame ? true : false;

    if (this.blMaitre) {
      this.IsInit = true;
      this.partageLien = window.location.href;
      this.getCurrentGameFromCookie();

      if (!this.currentGame) {
        this.currentGame = new Game({
          idGame: this.idCurrentGame,
          idPlaylist: this.idCurrentPlaylist,
          playlistName: this.currentPlaylist?.name,
          players: [],
          currentSong: 0,
          userPseudo: '',
        });
      }
      this.setUpdatedCurrentGameInCookie();
    }
    // ask for name
    this.getPseudo();
  }

  getSocketGame(): void {
    if (this.currentGame) {
      this.joueur = this.currentGame.players.filter(x => x.id === this.playerIdentity.id && x.pseudo === this.playerIdentity.pseudo)[0];
    }
    if (!this.joueur) {
      this.joueur = new Player({
        pseudo: this.playerIdentity.pseudo,
        score: 0,
        statut: this.blMaitre ? 'master' : 'guest',
        id: 1,
        currentSong: 0,
        isConnected: true
      });
      // currentGame nexiste pas

    }
    this.currentGame?.players.push(this.joueur);


    // if (this.getJoueursByPseudo(this.playerIdentity.pseudo) === null && this.blMaitre) {
    //   this.currentGame.players.push(this.joueur);
    // }
    this.socketService.setupSocketConnection(
      // todo remplacer par objet et transmettre id aussi
      this.playerIdentity.pseudo + '/' + this.idCurrentPlaylist + '/' + this.idCurrentGame
    );

    document.title = this.playerIdentity.pseudo + ' - Blindtest';
    // sessionStorage.setItem('pseudo', this.pseudo);

    // pseudo et id (manque id)
    this.cookieService.setCookie('pseudo', JSON.stringify(this.playerIdentity));

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
        // sessionStorage.getItem(this.idCurrentPlaylist)
        this.cookieService.get(this.idCurrentPlaylist)
      );
      // const stringPlaylist = sessionStorage.getItem(this.idCurrentPlaylist);
      const stringPlaylist = this.cookieService.get(this.idCurrentPlaylist);

      this.currentPlaylist = playlist;
      this.currentGame.playlistName = this.currentPlaylist.name;

      this.socketService.sendDataPlaylist(stringPlaylist);
      const maxPlayer = this.currentGame.players.reduce((prev, current) => (prev.id > current.id) ? prev : current);

      // Master ajoute le nouveau joueur, il incremente l'id
      // Verifie si existe déjà ( = doit recevoir pseudo + id du back)
      const nouveauJoueur = new Player({
        pseudo: message.message,
        score: 0,
        statut: 'guest',
        id: maxPlayer.id + 1,
        currentSong: 0,
        isConnected: true
      });
      this.currentGame.players.push(nouveauJoueur);
      if (this.getJoueursByPseudo(this.playerIdentity.pseudo)) {

      }

      this.setUpdatedCurrentGameInCookie();

      // todo pb: une fois reçu et mis en cookie par le joueur , des / sont ajoutés
      this.socketService.sendJoueurs(JSON.stringify(this.currentGame));
    });

    this.socketService.getData('reussite').subscribe((gameData: any) => {
      this.currentGame = gameData;
      const MyMessage: IMessage = new Message();
      MyMessage.pseudo = '';
      MyMessage.message = this.currentGame.userPseudo + ' a trouvé!';
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      this.addMessage(MyMessage);

      // Ajout maj session joueurs
      this.lecturePlaylist();
    });

    this.socketService.getData('nextSong').subscribe((gameData: any) => {
      const isAudioEnded = gameData.isAudioEnded;
      this.currentGame = gameData.dataGame;
      if (!isAudioEnded) {
        const MyMessage: IMessage = new Message();
        MyMessage.pseudo = '';
        MyMessage.message =
          this.currentGame.userPseudo + ' a cliqué sur chanson suivante';
        MyMessage.isUserMessage = false;
        MyMessage.id = 0;
        this.addMessage(MyMessage);
      }
      // Ajout maj session joueurs
      this.lecturePlaylist();
    });

    this.socketService.getData('start').subscribe((message: IMessage) => {
      message.isUserMessage = false;
      this.addMessage(message);
      this.arePlayBtnDisabled = false;
      this.currentGame.currentSong = 1;
      // sessionStorage.setItem(this.currentGame.idGame, JSON.stringify(this.currentGame));
      this.cookieService.setCookie(this.currentGame.idGame, JSON.stringify(this.currentGame));
      this.jouerOnePlaylist();
    });
    // Non utilisé pour l'instant car fait planté node
    this.socketService.getDisconnect().subscribe((playerName: string) => {

      const MyMessage: IMessage = new Message();
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      MyMessage.message = playerName + ' a quitté la partie, bye!';
      MyMessage.pseudo = '';
      this.currentGame.players.forEach(player => {
        if (player.pseudo === playerName) {
          player.isConnected = false;
        }
      });
      this.addMessage(MyMessage);

    });

    this.socketService.getPlay().subscribe((pseudo: any) => {
      const MyMessage: IMessage = new Message();
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      MyMessage.message = pseudo + ' a cliqué sur le bouton play/pause';
      MyMessage.pseudo = '';
      this.addMessage(MyMessage);
      if (pseudo === this.playerIdentity.pseudo) {
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

      // sessionStorage.setItem(
      //   dataPlaylist.id.toString(),
      //   dataPlaylist.dataPlaylist
      // );
      this.cookieService.setCookie(
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

      // sessionStorage.setItem(this.currentGame.idGame, dataGame);

      this.setUpdatedCurrentGameInCookie();
      // this.cookieService.setCookie(this.currentGame.idGame, dataGame);
      this.compteurTrack = this.currentGame.currentSong;
      if (this.currentGame.currentSong > 0) {
        this.arePlayBtnDisabled = false;
      }
    });
  }
  // FIN NGONINIT

  getPseudo(): void {
    const maybePseudo = this.cookieService.get('pseudo');
    if (maybePseudo) {
      this.playerIdentity = JSON.parse(maybePseudo);
    }


    if (!this.playerIdentity || !this.playerIdentity.pseudo) {
      const dialogRef = this.dialog.open(AddPseudoDialogComponent, {
        width: '400px',
        data: 'Choisi ton pseudo :'
      });
      // Todo verifie existence pseudo ou incrémente pseudo existant

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.playerIdentity.pseudo = result;
        this.getSocketGame();
      });
    } else {
      // déplacer getSocketGame en ajoutant subscribe
      this.getSocketGame();
    }
  }
  setUpdatedCurrentGameInCookie(): void {
    this.cookieService.setCookie(
      this.idCurrentGame,
      JSON.stringify(this.currentGame)
    );

  }

  getCurrentGameFromCookie(): void {
    const game = this.cookieService.get(this.idCurrentGame);
    if (game) {
      this.currentGame = JSON.parse(game);
    }


  }
  getURLData(): void {
    // Utiliser activatedroute (voir timesheet)
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
    // add ID
    if (!this.currentGame) {
      return;
    }
    const result = this.currentGame.players.filter(
      (joueur) => joueur.pseudo === pseudo
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
    myMessage.pseudo = this.playerIdentity.pseudo;
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
    this.socketService.commencerPartie(this.playerIdentity.pseudo);
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
    // const playlist = JSON.parse(sessionStorage.getItem(id));
    const playlist = JSON.parse(this.cookieService.get(id));

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
      this.snackBar.open(
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

    this.snackBar.open(
      `${winner.pseudo} a gagné la partie avec une score de ${winner.score}/20!`
    );
    this.arePlayBtnDisabled = true;
  }

  playPausePressed(): void {
    console.log('Play Pause Pressed');
    // send playpausepressed, declenche click chez les autres
    this.socketService.sendPlay(this.playerIdentity.pseudo);
  }
  onAudioEnded(): void {
    this.chansonSuivante(true);
  }

  chansonSuivante(isAudioEnded: boolean): void {
    if (this.arePlayBtnDisabled) {
      return;
    }
    this.currentGame.userPseudo = this.playerIdentity.pseudo;
    this.socketService.sendChansonSuivant(this.currentGame, isAudioEnded);
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
      this.snackBar.open(
        `Bravo, c'était ${this.currentPlaylist.tracks[this.compteurTrack].name
        } de ${this.currentPlaylist.tracks[this.compteurTrack].artist}  `,
        'X',
        {
          duration: 2000,
        }
      );
      // this.lecturePlaylist();
      this.currentGame.players.filter(
        (joueur) => joueur.pseudo === this.playerIdentity.pseudo
      )[0].score++;
      this.currentGame.userPseudo = this.playerIdentity.pseudo;
      this.socketService.sendReussite(this.currentGame);
    } else {
      this.snackBar.open('Nope, try again... ', 'X', {
        duration: 2000,
      });
      console.log('faux');
    }
  }

  RetourChoixPlaylist(): void {
    this.cookieService.delete(this.idCurrentGame);
    this.cookieService.delete(this.idCurrentPlaylist);
    this.router.navigate(['/choix-playlist']);
  }

  copyLink(): void {
    const el = document.createElement('textarea');
    el.value = this.partageLien;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.snackBar.open('Le lien a été copié', 'X', { duration: 2000, });
  }
}
