import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { Subject } from 'rxjs';

@Injectable()
export class MultiJoueurService {
  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebSocketService) {
    // this.messages = wsService.connect().next(Response: any): any => {
    //   return response;
    // }) as Subject<any>;
  }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg): string {
    // this.messages.next(msg);
    return 'bla';
  }
}
