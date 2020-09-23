import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-button',
  templateUrl: './simple-button.component.html',
  styleUrls: ['./simple-button.component.scss'],
})
export class SimpleButtonComponent implements OnInit {
  @Input() title: string;
  @Input() isDisable: boolean;
  constructor() {}

  ngOnInit(): void {}
}
