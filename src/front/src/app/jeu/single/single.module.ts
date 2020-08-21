import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleComponent } from './single/single.component';
import { routes } from './jeu-single.route';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SingleComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class SingleModule {}
