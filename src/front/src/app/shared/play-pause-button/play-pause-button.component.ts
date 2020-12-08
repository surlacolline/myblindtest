import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-play-pause-button',
  templateUrl: './play-pause-button.component.html',
  styleUrls: ['./play-pause-button.component.scss'],
})
export class PlayPauseButtonComponent implements OnInit {
  @Output() playPausePressed = new EventEmitter();

  playPause = false;

  constructor() {}

  ngOnInit(): void {}

  playpause() {
    this.playPause = !this.playPause;
    this.playPausePressed.emit(this.playPause);
  }

  onNextSong(): void {
    this.playPause = !this.playPause;
  }
}
