import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroFrameComponent } from './hero-frame/hero-frame.component';
import { ConnexionButtonComponent } from './connexion-button/connexion-button.component';
import { ListeDeroulanteComponent } from './liste-deroulante/liste-deroulante.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { PlayPauseButtonComponent } from './play-pause-button/play-pause-button.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { SimpleButtonComponent } from './simple-button/simple-button.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { InfoPopupComponent } from './info-popup/info-popup.component';
import { InfoButtonComponent } from './info-button/info-button.component';

@NgModule({
  declarations: [
    HeroFrameComponent,
    ConnexionButtonComponent,
    ListeDeroulanteComponent,
    ProgressBarComponent,
    ToggleButtonComponent,
    PlayPauseButtonComponent,
    SnackbarComponent,
    AudioPlayerComponent,
    SimpleButtonComponent,
    InfoPopupComponent,
    InfoButtonComponent,
  ],
  imports: [CommonModule, MatExpansionModule],
  exports: [
    HeroFrameComponent,
    ConnexionButtonComponent,
    ListeDeroulanteComponent,
    AudioPlayerComponent,
    SimpleButtonComponent,
    ProgressBarComponent,
    InfoPopupComponent,
    InfoButtonComponent,
  ],
})
export class SharedModule {}
