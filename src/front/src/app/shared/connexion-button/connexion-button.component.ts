import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-connexion-button',
  templateUrl: './connexion-button.component.html',
  styleUrls: ['./connexion-button.component.scss'],
})
export class ConnexionButtonComponent implements OnInit {
  @Output() connexionEvent = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onConnexion(): void {
    this.connexionEvent.emit();
  }
}
