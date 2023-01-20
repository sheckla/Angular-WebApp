import { Component } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { ErrorMessagesService } from '../services/error-messages.service';
import { MatDialog } from '@angular/material/dialog'


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  errorDisplayMessage = '';

  constructor(
    private userHandlerService: UserHandlerService,
    private errorMessageService: ErrorMessagesService,
    private dialog: MatDialog) {
  }

  login(name) {
    // Username length check
    if (name.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginUsernameTooShort;
      return;
    }

    /* Don't close connection at failed request
    /// TODO: Was ist performanter:
    *       Socket-Connection aufrechterhalten bis neuer Login Request
    *       ODER
    *       Jedesmal neue Verbindung bei neuem Login
    /// TODO: Timeout einbauen um Ressourcen zu sparen
    */

    // Async establishConnection call
    this.userHandlerService.getClientSocket().establishConnection().then( () => {
      this.userHandlerService.initQuizGameListeners();
      this.userHandlerService.login(name);
    });
  }
}
