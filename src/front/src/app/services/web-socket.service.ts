import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class WebSocketService {
  // Our socket connection
  private socket;

  constructor() {}

  setupSocketConnection(data: string): void {
    this.socket = io(environment.ws_url);
    this.socket.emit('nouveau_joueur', data);
  }

  public sendMessage(message) {
    this.socket.emit('message', message);
  }

  public sendDataPlaylist(dataPlaylist) {
    this.socket.emit('dataPlaylist', dataPlaylist);
  }

  public sendJoueurs(dataJoueurs) {
    this.socket.emit('dataJoueurs', dataJoueurs);
  }
  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  };

  public getNouveauJoueur = () => {
    return Observable.create((observer) => {
      this.socket.on('nouveau_joueur', (pseudo) => {
        observer.next({ pseudo: 'Nouveau joueur ', message: pseudo });
      });
    });
  };

  public getReussite = () => {
    return Observable.create((observer) => {
      this.socket.on('reussite', (data) => {
        observer.next(data);
      });
    });
  };

  public getStart = () => {
    return Observable.create((observer) => {
      this.socket.on('start', (data) => {
        observer.next(data);
      });
    });
  };

  public getDataPlaylist = () => {
    return Observable.create((observer) => {
      this.socket.on('dataPlaylist', (data) => {
        observer.next(data);
      });
    });
  };

  public getDataJoueurs = () => {
    return Observable.create((observer) => {
      this.socket.on('dataJoueurs', (data) => {
        observer.next(data);
      });
    });
  };

  commencerPartie(pseudo: string): void {
    this.socket.emit('start', pseudo);
  }

  sendChansonSuivant(joueurs): void {
    this.socket.emit('reussite', joueurs);
  }
  sendReussite(joueurs): void {
    this.socket.emit('reussite', joueurs);
  }
}
