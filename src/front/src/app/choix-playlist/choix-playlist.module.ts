import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoixPlaylistComponent } from './choix-playlist.component';
import { RouterModule } from '@angular/router';
import { routes } from './choix-playlist.route';
import { SharedModule } from '../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [ChoixPlaylistComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MatExpansionModule,
  ],
})
export class ChoixPlaylistModule {}
