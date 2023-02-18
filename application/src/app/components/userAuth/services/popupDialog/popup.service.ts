import { Component, Inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  showPopup(title:string, content: string, action: string): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        content: content,
        action: action,
       }
    });
  }

  showPopupSelectable(title:string, content:string): MatDialogRef<DialogSelectableComponent> {
    return this.dialog.open(DialogSelectableComponent, {
      data: {
        title: title,
        content: content,
      }
    })
  }

}

@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css']
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.selectable.component.html',
  styleUrls: ['dialog.component.css']
})
export class DialogSelectableComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(dialog: any) {
    this.dialogRef.close(dialog);
  }
}
