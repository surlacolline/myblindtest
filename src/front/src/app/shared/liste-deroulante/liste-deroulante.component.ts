import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-liste-deroulante',
  templateUrl: './liste-deroulante.component.html',
  styleUrls: ['./liste-deroulante.component.scss'],
})
export class ListeDeroulanteComponent implements OnInit {
  constructor() {}
  @Input() title: string;
  @Input() playlists: any[];

  @Output() toggled = new EventEmitter();
  @Output() itemSelectedEvent = new EventEmitter();
  Counter = 0;
  panelOpenState = false;

  ngOnInit(): void {}
  toggle() {
    // You can give any function name

    this.toggled.emit();
  }

  itemSelected(playlist: any) {
    // You can give any function name

    this.itemSelectedEvent.emit(playlist);
  }
}
