import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiComponent } from './multi/multi.component';
import { routes } from './jeu-multi.route';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { JeuModule } from '../jeu.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { MatCardModule } from '@angular/material/card';
import { AddPseudoDialogComponent } from './add-pseudo-dialog/add-pseudo-dialog.component';

@NgModule({
  declarations: [MultiComponent, AddPseudoDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    JeuModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
  ],
  providers: [WebSocketService],
})
export class MultiModule {}
