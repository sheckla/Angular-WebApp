import { Component, Inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SettingHandlerService } from '../setting-handler.service';
import { UserHandlerService } from '../user-handler.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  showPopup(
    title: string,
    content: string,
    action: string
  ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        content: content,
        action: action,
      },
    });
  }

  showWinnerPopup(users: any[]): MatDialogRef<DialogWinnerComponent> {
    console.log('from popup here');
    var newUsers: any[] = [];
    users.forEach((user) => {
      var userCopy = {
        name: user.name,
        currentScore: user.currentScore,
      };
      newUsers.push(userCopy);
    });
    console.log(newUsers);
    return this.dialog.open(DialogWinnerComponent, {
      data: {
        user: newUsers,
      },
    });
    console.log(users.length);
  }

  showPopupSelectable(
    title: string,
    content: string
  ): MatDialogRef<DialogSelectableComponent> {
    return this.dialog.open(DialogSelectableComponent, {
      data: {
        title: title,
        content: content,
      },
    });
  }
}

@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.component.html',
  styleUrls: ['dialog.component.css'],
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
  styleUrls: ['dialog.component.css'],
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

@Component({
  selector: 'dialog-component',
  templateUrl: 'dialog.winner.component.html',
  styleUrls: ['dialog.component.css'],
})
export class DialogWinnerComponent {
  constructor(
    public settingHandler: SettingHandlerService,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
