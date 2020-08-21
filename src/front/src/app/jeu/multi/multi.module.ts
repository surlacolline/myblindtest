import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiComponent } from './multi/multi.component';
import { routes } from './jeu-multi.route';
import { RouterModule } from '@angular/router';
import { JeuModule } from '../jeu.module';

@NgModule({
  declarations: [MultiComponent],
  imports: [CommonModule, RouterModule.forChild(routes), JeuModule],
})
export class MultiModule {}
