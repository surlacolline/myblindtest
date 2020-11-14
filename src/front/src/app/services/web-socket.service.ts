import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import Message, { IMessage } from 'src/app/shared-model/Message.model';

@Injectable()
export class WebSocketService {
  // Our socket connection
  private socket;

  constructor() { }

  setupSocketConnection(data: string): void {
    this.socket = io(
      environment.production ? window.location.origin : environment.ws_url
    );
    this.socket.emit('nouveau_joueur', data);
  }

  public sendMessage(message: IMessage) {
    this.socket.emit('message', message);
  }

  public sendDataPlaylist(dataPlaylist) {
    this.socket.emit('dataPlaylist', dataPlaylist);
  }

  public sendJoueurs(dataGame) {
    this.socket.emit('dataJoueurs', dataGame);
  }

  commencerPartie(pseudo: string): void {
    this.socket.emit('start', pseudo);
  }

  sendChansonSuivant(dataGame): void {
    this.socket.emit('nextSong', dataGame);
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
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  }

  public getNouveauJoueur = () => {
    return Observable.create((observer) => {
      this.socket.on('nouveau_joueur', (pseudo) => {
        observer.next({ pseudo: 'Nouveau joueur ', message: pseudo });
      });
    });
  }

  public getReussite = () => {
    return Observable.create((observer) => {
      this.socket.on('reussite', (data) => {
        observer.next(data);
      });
    });
  }

  public getNextSong = () => {
    return Observable.create((observer) => {
      this.socket.on('nextSong', (data) => {
        observer.next(data);
      });
    });
  }

  public getStart = () => {
    return Observable.create((observer) => {
      this.socket.on('start', (data) => {
        observer.next(data);
      });
    });
  }

  public getPlay = () => {
    return Observable.create((observer) => {
      this.socket.on('play', (data) => {
        observer.next(data);
      });
    });
  }

  public getPause = () => {
    return Observable.create((observer) => {
      this.socket.on('pause', (data) => {
        observer.next(data);
      });
    });
  }

  public getDataPlaylist = () => {
    return Observable.create((observer) => {
      this.socket.on('dataPlaylist', (data) => {
        observer.next(data);
      });
    });
  }

  public getDataJoueurs = () => {
    return Observable.create((observer) => {
      this.socket.on('dataJoueurs', (data) => {
        observer.next(data);
      });
    });
  }
  // Non utilisé pour l'instant car fait planté node
  public getDisconnect = () => {
    return Observable.create((observer) => {
      this.socket.on('disconnect', (data) => {
        observer.next(data);
      });
    });
  }
}
