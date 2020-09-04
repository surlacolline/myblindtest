import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-liste-deroulante',
  templateUrl: './liste-deroulante.component.html',
  styleUrls: ['./liste-deroulante.component.scss'],
})
export class ListeDeroulanteComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() title: string;
  @Input() items: any[];

  @Output() toggled = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Output() itemSelectedEvent = new EventEmitter();
  @Output() showMoreEvent = new EventEmitter();
  Counter = 0;
  styleIcon = 'icon-circle-down';
  @Input() blOpenClose = false;
  @ViewChild(MatExpansionPanel, { static: true })
  matExpansionPanelElement: MatExpansionPanel;
  ngOnChanges(changes: SimpleChanges): void {
    const a = 5;
  }

  ngOnInit(): void {}

  toggle(blExpanded): void {
    // You can give any function name
    if (blExpanded) {
      this.styleIcon = 'icon-circle-up';
    } else {
      this.styleIcon = 'icon-circle-down';
    }

    this.toggled.emit(blExpanded);
  }
  selectItem(): void {
    this.matExpansionPanelElement.close(); // open()
  }
  itemSelected(item: any): void {
    // You can give any function name

    this.itemSelectedEvent.emit(item);
  }
  showMore(): void {
    this.showMoreEvent.emit();
    this.blOpenClose = false;
    console.log(this.blOpenClose);
    setTimeout(() => console.log(this.matExpansionPanelElement.expanded));
  }
  setBlOpenClose(pOpenClose): void {
    this.blOpenClose = pOpenClose;
    if (this.blOpenClose) {
      this.styleIcon = 'icon-circle-up';
      this.toggled.emit(this.blOpenClose);
    } else {
      this.styleIcon = 'icon-circle-down';
    }
  }
}
