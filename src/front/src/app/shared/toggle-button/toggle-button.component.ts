import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class ToggleButtonComponent implements OnInit {
  @Output() toggleEvent = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.toggleEvent.emit();
  }
}
