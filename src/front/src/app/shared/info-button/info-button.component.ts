import { Component, OnInit } from '@angular/core';
import { ShowInfoPopupService } from '../../services/show-info-popup.service';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.scss'],
})
export class InfoButtonComponent implements OnInit {
  constructor(private showInfoPopupService: ShowInfoPopupService) {}

  ngOnInit(): void {}

  showPopupInfo() {
    this.showInfoPopupService.openDialog();
  }
}
