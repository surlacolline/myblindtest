import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { IMessage } from 'src/app/shared-model/Message.model';
import { environment } from '../../environments/environment';
import { IGame } from '../shared-model/Game.model';
import { IPlayerIdentity } from '../shared-model/Player.model';
import { IPlaylist } from '../shared-model/Playlist.model';


@Injectable()
export class WebSocketService {
  // Our socket connection
  private socket: SocketIOClient.Socket;

  constructor() { }

  setupSocketConnection(playerAndGameIdentity: { pseudo: string, idPlayer: number, secretIdPlayer: string, idCurrentPlaylist: string, idCurrentGame: string }): void {
    this.socket = io(
      environment.production ? window.location.origin : environment.ws_url
    );
    this.socket.emit('nouveau_joueur', playerAndGameIdentity);
  }

  disconnect(playerIdentity: IPlayerIdentity) {
    this.socket.emit('quitGame', playerIdentity);
  }

  sendMessage(message: IMessage): void {
    this.socket.emit('message', message);
  }

  sendDataPlaylist(dataPlaylist: IPlaylist): void {
    this.socket.emit('dataPlaylist', dataPlaylist);
  }

  sendJoueurs(dataGame: IGame): void {
    this.socket.emit('dataJoueurs', dataGame);
  }

  commencerPartie(pseudo: string): void {
    this.socket.emit('start', pseudo);
  }

  sendChansonSuivant(dataGame, isAudioEnded: boolean): void {

    this.socket.emit('nextSong', { dataGame, isAudioEnded });
  }
  sendPlayerIdentity(playerIdentity: IPlayerIdentity): void {
    this.socket.emit('playerIdentity', playerIdentity);
  }
  sendReussite(dataGame): void {
    this.socket.emit('reussite', dataGame);
  }

  sendPlay(pseudo: string): void {
    this.socket.emit('play', pseudo);
  }

  sendPause(): void {
    this.socket.emit('pause');
  }

  // GET
  public getMessages = () => {
    return new Observable((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  public getNouveauJoueur = () => {
    return new Observable((observer) => {
      this.socket.on('nouveau_joueur', (playerIdentity: IPlayerIdentity) => {
        observer.next(playerIdentity);
      });
    });
  }


  // refacto en cours
  public getData = (dataType: 'nextSong' | 'reussite' | 'start') => {
    return new Observable((observer) => {
      this.socket.on(dataType, (data) => {
        observer.next(data);
      });
    });
  }



  public getPlay = () => {
    return new Observable((observer) => {
      this.socket.on('play', (data) => {
        observer.next(data);
      });
    });
  }

  public getPause = () => {
    return new Observable((observer) => {
      this.socket.on('pause', (data) => {
        observer.next(data);
      });
    });
  }

  public getDataPlaylist = () => {
    return new Observable((observer) => {
      this.socket.on('dataPlaylist', (data: IPlaylist) => {
        observer.next(data);
      });
    });
  }

  public getDataJoueurs = () => {
    return new Observable((observer) => {
      this.socket.on('dataJoueurs', (data) => {
        observer.next(data);
      });
    });
  }
  // Non utilisé pour l'instant car fait planté node
  public getDisconnect = () => {
    return new Observable((observer) => {
      this.socket.on('user_leave', (playerIdentity: IPlayerIdentity) => {
        observer.next(playerIdentity);
      });
    });
  }
}
