import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-pseudo-dialog',
  templateUrl: './add-pseudo-dialog.component.html',
  styleUrls: ['./add-pseudo-dialog.component.scss']
})
export class AddPseudoDialogComponent implements OnInit {
  pseudo: 'Anonyme';

  constructor(
    public dialogRef: MatDialogRef<AddPseudoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
