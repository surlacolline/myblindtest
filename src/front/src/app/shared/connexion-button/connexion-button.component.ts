import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-connexion-button',
  templateUrl: './connexion-button.component.html',
  styleUrls: ['./connexion-button.component.scss'],
})
export class ConnexionButtonComponent implements OnInit {
  @Output() connexionEvent = new EventEmitter();
  @Input() title = 'Connexion';
  constructor() { }

  ngOnInit(): void { }

  onConnexion(): void {
    this.connexionEvent.emit();
  }

  getCookie(name): string {
    if (document.cookie.length === 0) {
      return null;
    }

    const regSepCookie = new RegExp('(; )', 'g');
    const cookies = document.cookie.split(regSepCookie);

    for (let i = 0; i < cookies.length; i++) {
      const regInfo = new RegExp('=', 'g');
      const infos = cookies[i].split(regInfo);
      if (infos[0] == name) {
        return unescape(infos[1]);
      }
    }
    return null;
  }
}
