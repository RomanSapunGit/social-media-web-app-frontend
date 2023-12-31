import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatDialogService} from "../../../services/mat-dialog.service";

@Component({
  selector: 'app-saved-entities',
  templateUrl: './saved-entities.component.html',
  styleUrls: ['./saved-entities.component.scss']
})
export class SavedEntitiesComponent {
  currentActiveButton: string = 'posts';
  currentState: string = 'posts';
  constructor(private matDialogRef: MatDialogRef<SavedEntitiesComponent>,
              private matDialogService: MatDialogService) {
  }

  closeDialog(): void {

    this.matDialogService.dialogClosed();
    this.matDialogRef.close();
  }
  setActiveButton(button: string): void {
    this.currentActiveButton = button;
    this.currentState = button;
  }
}
