import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  @Input() src: string;
  @Input() autoplay: boolean;
  @Output() playPausePressedEvent = new EventEmitter();
  @Output() audioEndedEvent = new EventEmitter();
  @Output() NextSongEvent = new EventEmitter();
  @ViewChild('audioPlayer') myAudioPlayer: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  playPausePressed(): void {
    if (this.myAudioPlayer.nativeElement.paused) {
      this.myAudioPlayer.nativeElement.volume = 0.1;
      this.myAudioPlayer.nativeElement.play();
    } else {
      this.myAudioPlayer.nativeElement.pause();
    }
    this.playPausePressedEvent.emit();
  }

  audioEnded(): void {
    this.audioEndedEvent.emit();
  }

  onNextSong(): void {
    this.NextSongEvent.emit();
  }
}
