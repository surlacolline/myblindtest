import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'choix-playlist',
    loadChildren: () =>
      import('./choix-playlist/choix-playlist.module').then(
        (m) => m.ChoixPlaylistModule
      ),
  },
  {
    path: 'jeu-single',
    loadChildren: () =>
      import('./jeu/single/single.module').then((m) => m.SingleModule),
  },
  {
    path: 'jeu-multi',
    loadChildren: () =>
      import('./jeu/multi/multi.module').then((m) => m.MultiModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
