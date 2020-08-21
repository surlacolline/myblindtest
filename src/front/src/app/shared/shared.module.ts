import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroFrameComponent } from './hero-frame/hero-frame.component';
import { ConnexionButtonComponent } from './connexion-button/connexion-button.component';
import { ListeDeroulanteComponent } from './liste-deroulante/liste-deroulante.component';

@NgModule({
  declarations: [
    HeroFrameComponent,
    ConnexionButtonComponent,
    ListeDeroulanteComponent,
  ],
  imports: [CommonModule],
  exports: [
    HeroFrameComponent,
    ConnexionButtonComponent,
    ListeDeroulanteComponent,
  ],
})
export class SharedModule {}
