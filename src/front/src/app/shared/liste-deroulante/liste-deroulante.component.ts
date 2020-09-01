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
  @Input() items: any[];

  @Output() toggled = new EventEmitter();
  @Output() itemSelectedEvent = new EventEmitter();
  @Output() showMoreEvent = new EventEmitter();
  Counter = 0;

  @Input() blOpenClose: boolean;

  ngOnInit(): void {}
  toggle(): void {
    // You can give any function name

    this.toggled.emit();
  }

  itemSelected(item: any): void {
    // You can give any function name

    this.itemSelectedEvent.emit(item);
  }
  showMore(): void {
    this.showMoreEvent.emit();
  }
}
