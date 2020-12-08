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
  constructor() { }
  @Input() title: string;
  @Input() items: any[];
  @Input() blOpenClose = false;
  @Input() isItemsPlaylists;
  @Input() isMoreButtonVisible: boolean;
  @Input() offset: number;
  @Input() total: number;
  @Input() limit: number;

  @Output() toggled = new EventEmitter();
  @Output() opened = new EventEmitter();
  @Output() itemSelectedEvent = new EventEmitter<{
    item: any;
    isMulti: boolean;
  }>();
  @Output() showMoreEvent = new EventEmitter();
  @Output() showBeforeEvent = new EventEmitter();

  Counter = 0;
  isIconUp: boolean;
  styleIcon = 'icon-circle-down';
  scroll: number;

  @ViewChild(MatExpansionPanel, { static: true })
  matExpansionPanelElement: MatExpansionPanel;
  ngOnChanges(changes: SimpleChanges): void {
    const a = 5;
    if (changes.items) {
      this.scroll = 0;
    }
  }

  ngOnInit(): void { }

  format(value: string): string {
    return value.length > 50 ? `${value.substring(0, 50)} ...` : value;
  }

  selectItem(): void {
    this.matExpansionPanelElement.close(); // open()
  }
  itemSelected(item: any, isMulti: boolean): void {
    // You can give any function name
    this.itemSelectedEvent.emit({ item, isMulti });
  }
  showMore(): void {
    this.showMoreEvent.emit();
  }

  showBefore(): void {
    this.showBeforeEvent.emit();
  }

  setBlOpenClose(pOpenClose): void {
    this.blOpenClose = pOpenClose;
    if (this.blOpenClose) {
      this.isIconUp = true;
      this.toggled.emit(this.matExpansionPanelElement);
    } else {
      this.isIconUp = false;
    }
  }

  onScroll(event: any): void {
    this.scroll = event.target.scrollTop;
  }
}
