import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent {

  warningMessage: string = '';

  constructor(private dialogRef: MatDialogRef<WarningDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: string) {
    this.warningMessage = data;
  }

  close() {
    this.dialogRef.close();
  }
}
