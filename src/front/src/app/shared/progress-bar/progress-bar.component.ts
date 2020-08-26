import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit, OnChanges {
  @Input() audioProgressPercent;

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: any): void {
    console.log(this.audioProgressPercent);
  }
}
