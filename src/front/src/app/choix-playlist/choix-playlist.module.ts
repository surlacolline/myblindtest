import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoixPlaylistComponent } from './choix-playlist.component';
import { RouterModule } from '@angular/router';
import { routes } from './choix-playlist.route';

@NgModule({
  declarations: [ChoixPlaylistComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class ChoixPlaylistModule {}
