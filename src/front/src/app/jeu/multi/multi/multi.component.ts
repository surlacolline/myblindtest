import {
  Component,
  ElementRef, OnDestroy, OnInit,
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
import { Subscription } from 'rxjs';
import { HelperService } from 'src/app/core/helpers/helper.service';
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
export class MultiComponent implements OnInit, OnDestroy {
  resultat: string;
  score = 0;
  avancement: string;
  currentPlaylist: IPlaylist;

  lecteurAudio: any;
  idCurrentPlaylist: any;
  src: string;
  autoplay: boolean;
  placeholder = 'Une idée du nom de la chanson ou de l\'artiste?';
  tryButtonTitle = 'Je me lance!';
  chansonSuivanteTitle = 'Aucune idée , Chanson suivante!';
  adresseActuelle: Location;
  adresseActuelleSplited: string[];
  IsInit = true;
  FinishedGame = false;
  idCurrentGame: string;
  blMaitre: boolean = false;
  IsInitCardDisplayed = this.IsInit && this.blMaitre && !this.FinishedGame;
  partageLien = '';
  tryAnswer: FormControl;
  singlePlayForm: FormGroup;
  playerIdentity: IPlayerIdentity = { id: 1, pseudo: '', secretId: this.helperService.generateRandomString(5) };
  joueur: IPlayer;
  message: string;
  messages: IMessage[] = [];
  currentGame: IGame;
  private subscription = new Subscription();

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
    private cookieService: CookieService2,
    private helperService: HelperService
  ) {
    this.tryAnswer = new FormControl('', [Validators.required]);
    this.singlePlayForm = this.builder.group({ tryAnwser: this.tryAnswer });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.getURLData();


    this.blMaitre =
      this.cookieService.get('master') === this.idCurrentGame ? true : false;

    this.getCurrentGameFromCookie();
    this.getCurrentPlaylistFromCookie();

    if (this.blMaitre) {
      // Si reconnexion de Master alors isInit = false
      this.partageLien = window.location.href;

      if (!this.currentGame) {
        this.IsInit = true;
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
    if (!this.currentGame || this.currentGame?.currentSong === 0) {
      this.IsInit = true;
    } else {
      this.IsInit = false;
    }
    // ask for name
    this.getPseudo();

    this.IsInitCardDisplayed = this.IsInit && this.blMaitre && !this.FinishedGame;
  }

  getSocketGame(): void {
    this.joueur = this.getPlayerByIdentity(this.playerIdentity.pseudo, this.playerIdentity.id, this.playerIdentity.secretId)

    if (!this.joueur) {
      this.joueur = new Player({
        pseudo: this.playerIdentity.pseudo,
        score: 0,
        statut: this.blMaitre ? 'master' : 'guest',
        id: 1,
        currentSong: 0,
        isConnected: true,
        secretId: this.playerIdentity.secretId
      });
      // currentGame nexiste pas  
      this.currentGame?.players.push(this.joueur);
      this.setUpdatedCurrentGameInCookie();
    }

    this.socketService.setupSocketConnection(
      // todo ecire model objet
      {
        pseudo: this.playerIdentity.pseudo,
        idPlayer: this.playerIdentity.id,
        secretIdPlayer: this.playerIdentity.secretId,
        idCurrentPlaylist: this.idCurrentPlaylist,
        idCurrentGame: this.idCurrentGame
      }
    );

    document.title = this.playerIdentity.pseudo + ' - Blindtest';

    this.cookieService.setCookie('pseudo', JSON.stringify(this.playerIdentity));

    // Quand un nouveau joueur se connecte, on affiche l'information
    this.subscription.add(this.socketService.getMessages().subscribe((message: IMessage) => {
      this.addMessage(message);
    }));

    this.subscription.add(this.socketService.getNouveauJoueur().subscribe((newPlayerIdentity: IPlayerIdentity) => {
      const message = new Message();
      message.isUserMessage = true;
      message.pseudo = newPlayerIdentity.pseudo;
      const existingPlayer = this.getPlayerByIdentity(newPlayerIdentity.pseudo, newPlayerIdentity.id, newPlayerIdentity.secretId);
      if (existingPlayer) {

        existingPlayer.isConnected = true;
        message.message = 'Reconnexion ';
        this.addMessage(message);
      } else {
        message.message = 'Nouveau joueur ';

        this.addMessage(message);

        if (!this.blMaitre) {
          return;
        }
        const maxPlayer = this.currentGame.players.reduce((prev, current) => (prev.id > current.id) ? prev : current);

        // Master ajoute le nouveau joueur, il incremente l'id
        const nouveauJoueur = new Player({
          pseudo: newPlayerIdentity.pseudo,
          score: 0,
          statut: 'guest',
          id: maxPlayer.id + 1,
          currentSong: 0,
          isConnected: true,
          secretId: newPlayerIdentity.secretId
        });
        this.currentGame.players.push(nouveauJoueur);
        this.setUpdatedCurrentGameInCookie();
      }
      const stringPlaylist = this.cookieService.get(this.idCurrentPlaylist);

      this.currentPlaylist = JSON.parse(stringPlaylist); // todo remplacer string par object et typé back et front
      this.currentGame.playlistName = this.currentPlaylist.name;

      this.socketService.sendDataPlaylist(this.currentPlaylist);

      this.setUpdatedCurrentGameInCookie();

      this.socketService.sendJoueurs(this.currentGame);
    }));

    this.subscription.add(this.socketService.getData('reussite').subscribe((gameData: any) => {
      this.currentGame = gameData;
      const MyMessage: IMessage = new Message();
      MyMessage.pseudo = '';
      MyMessage.message = this.currentGame.userPseudo + ' a trouvé!';
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      this.addMessage(MyMessage);

      // Ajout maj session joueurs
      this.lecturePlaylist();
    }));

    this.subscription.add(this.socketService.getData('nextSong').subscribe((gameData: any) => {
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
    }));

    this.subscription.add(this.socketService.getData('start').subscribe((message: IMessage) => {
      message.isUserMessage = false;
      this.addMessage(message);
      this.IsInit = false;
      this.currentGame.currentSong = 0;
      this.setUpdatedCurrentGameInCookie();
      this.jouerOnePlaylist();
    }));

    this.subscription.add(this.socketService.getDisconnect().subscribe((playerIdentity: IPlayerIdentity) => {
      const MyMessage: IMessage = new Message();
      MyMessage.isUserMessage = false;
      MyMessage.id = 0;
      MyMessage.message = playerIdentity.pseudo + ' a quitté la partie, bye!';
      MyMessage.pseudo = '';
      this.addMessage(MyMessage);
      const player: IPlayer = this.getPlayerByIdentity(playerIdentity.pseudo, playerIdentity.id, playerIdentity.secretId);
      if (player) {
        player.isConnected = false;
      }

    }));

    this.subscription.add(this.socketService.getPlay().subscribe((pseudo: any) => {
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
    }));

    this.subscription.add(this.socketService.getDataPlaylist().subscribe((dataPlaylist: any) => {
      console.log(dataPlaylist);
      if (this.blMaitre) {
        return;
      }
      const playlistJson = dataPlaylist.dataPlaylist.JSON;


      this.cookieService.setCookie(
        dataPlaylist.id.toString(),
        dataPlaylist.dataPlaylist
      );

      this.idCurrentPlaylist = dataPlaylist.id.toString();
      this.currentPlaylist = JSON.parse(dataPlaylist.dataPlaylist);
    }));

    this.subscription.add(this.socketService.getDataJoueurs().subscribe((dataGame: any) => {
      console.log(dataGame);
      if (this.blMaitre) {
        return;
      }
      // New player get back is identity
      this.currentGame = dataGame;
      const id = this.getPlayerBySecretId(this.playerIdentity.secretId).id;
      this.playerIdentity.id = id;
      this.setUpdatedCurrentGameInCookie();

      this.socketService.sendPlayerIdentity(this.playerIdentity);

      // maintenant que je connais mon  ID, je peux mettre à joueur mon socket dans le back
      this.cookieService.setCookie('pseudo', JSON.stringify(this.playerIdentity));
      this.setUpdatedCurrentGameInCookie();

      this.currentGame.currentSong = this.currentGame.currentSong;
      if (this.currentGame.currentSong > 0) {
        this.IsInit = false;
      }
    }));
  }


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
    if (this.currentGame) {
      this.cookieService.setCookie(
        this.idCurrentGame,
        JSON.stringify(this.currentGame)
      );
    }
  }

  getCurrentGameFromCookie(): void {
    const game = this.cookieService.get(this.idCurrentGame);
    if (game) {
      this.currentGame = JSON.parse(game);
    }
  }

  getCurrentPlaylistFromCookie(): void {
    const playlist = this.cookieService.get(this.idCurrentPlaylist);
    if (playlist) {
      this.currentPlaylist = JSON.parse(playlist);
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

  getPlayerBySecretId(secretId: string): IPlayer {
    if (!this.currentGame) {
      return;
    }

    const array1 = this.currentGame.players.sort((a, b) => {
      // If two elements have different number, then the one who has larger number wins
      return b.id - a.id;
    });

    const result = array1.filter((joueur) => joueur.secretId === secretId)[0];

    if (result) {
      return result;
    } else {
      return null;
    }
  }

  getPlayerByIdentity(pseudo: string, id: number, secretId: string): IPlayer {
    if (!this.currentGame) {
      return;
    }

    const result = this.currentGame.players.filter((joueur) => joueur.secretId === secretId
      && joueur.pseudo === pseudo
      && joueur.id === id)[0];

    if (result) {
      return result;
    } else {
      return null;
    }
  }

  sendMessage(): void {
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

  commencerPartie(): void {
    this.IsInit = false;
    this.socketService.commencerPartie(this.playerIdentity.pseudo);
    this.jouerOnePlaylist();
    this.IsInitCardDisplayed = this.IsInit && this.blMaitre && !this.FinishedGame;

  }

  jouerOnePlaylist(): void {
    this.currentPlaylist = this.getPlaylistFromSessionStorage(
      this.idCurrentPlaylist
    );
    if (this.currentPlaylist === undefined) {
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
    if (!this.currentPlaylist) {
      this.getCurrentPlaylistFromCookie();
    }
    if (!this.currentPlaylist) {
      return;
    }
    this.resultat = '';
    this.singlePlayForm.reset();
    if (this.currentGame.currentSong > 0) {
      this.snackBar.open(
        `C'était ${this.currentPlaylist.tracks[this.currentGame.currentSong].name} de ${this.currentPlaylist.tracks[this.currentGame.currentSong].artist
        }  `,
        'X',
        {
          duration: 2000,
        }
      );
    }
    this.currentGame.currentSong++;

    this.setUpdatedCurrentGameInCookie();

    if (this.currentGame.currentSong < this.currentPlaylist.tracks.length) {
      this.src = this.currentPlaylist.tracks[this.currentGame.currentSong].preview_url;
      this.autoplay = true;
      this.avancement =
        ' ' + this.currentGame.currentSong + ' / ' + this.currentPlaylist.tracks.length;
    } else {
      this.avancement =
        ' ' + this.currentGame.currentSong + ' / ' + this.currentPlaylist.tracks.length;
      this.src = null;
      this.autoplay = false;
      this.resultat =
        'La partie est finie! Bravo, votre score  est de ' + `${this.score}/20`;
      this.displayWinner();
    }
  }

  displayWinner(): void {
    // todo ajout confettis
    this.currentGame?.players.filter((value) => value.score);
    const winner = this.currentGame?.players.sort(function (a, b) {
      const lastPlayer = a.score;
      const nextPlayer = b.score;
      return lastPlayer > nextPlayer ? -1 : 1;
    })[0];

    this.snackBar.open(
      `${winner.pseudo} a gagné la partie avec une score de ${winner.score}/20!`
    );
    this.FinishedGame = true;
    this.IsInit = true;
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
    if (this.IsInit) {
      return;
    }
    this.currentGame.userPseudo = this.playerIdentity.pseudo;
    this.socketService.sendChansonSuivant(this.currentGame, isAudioEnded);
  }

  checkAnswer(event, ValueToTry: string): void {
    if (this.IsInit) {
      return;
    }
    let blResult: boolean;

    blResult = this.tryValueService.tryValue(
      ValueToTry,
      this.currentPlaylist.tracks[this.currentGame.currentSong],
      false
    );

    if (blResult) {
      this.score++;
      this.snackBar.open(
        `Bravo, c'était ${this.currentPlaylist.tracks[this.currentGame.currentSong].name
        } de ${this.currentPlaylist.tracks[this.currentGame.currentSong].artist}  `,
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
    this.socketService.disconnect(this.playerIdentity);
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
