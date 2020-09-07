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
    this.socket.on('nouveau_joueur', (data: string) => {
      console.log(data);
    });
  }

  sendMessage(): void {}
}
