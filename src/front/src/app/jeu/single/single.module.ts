import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleComponent } from './single/single.component';
import { routes } from './jeu-single.route';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SingleComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SingleModule {}
