import { Injectable } from '@angular/core';
import { InfoPopupComponent } from '../shared/info-popup/info-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ShowInfoPopupService {
  constructor(public dialog: MatDialog) {}
  openDialog() {
    this.dialog.open(InfoPopupComponent);
  }
}
