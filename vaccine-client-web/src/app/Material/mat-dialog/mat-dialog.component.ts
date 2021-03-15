import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrls: ['./mat-dialog.component.scss'],
})
export class MatDialogComponent implements OnInit {
  dialogRef: any;

  constructor() {}

  ngOnInit(): void {}
  close() {
    this.dialogRef.close(MatDialogComponent);
  }
}
