import {Component, Inject, Input} from '@angular/core';
import {NotificationService} from "../../../services/entity/notification.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatDialogService} from "../../../services/mat-dialog.service";

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {
   errorMessage: string
  constructor(private snackBarService: NotificationService, private matDialogRef: MatDialogRef<ErrorDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any, private matDialogService: MatDialogService) {
    this.errorMessage = data.toString();
  }

  closeDialog() {
    this.matDialogService.dialogClosed();
    this.matDialogRef.close();
  }
}
