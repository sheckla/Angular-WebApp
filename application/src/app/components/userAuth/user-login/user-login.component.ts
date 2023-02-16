import { Component } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { ErrorMessagesService } from '../services/error-messages.service';
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  errorDisplayMessage = '';
  loginMode: boolean = true;
  private _subscriptions: Subscription[] = [];

  constructor(
    private userHandlerService: UserHandlerService,
    private errorMessageService: ErrorMessagesService,
    private dialog: MatDialog) {
      this._subscriptions.push(
        this.userHandlerService.loginStatusEvent.subscribe((status) => {
          this.errorDisplayMessage = errorMessageService.LoginFailed;
        })
      )

      this._subscriptions.push(
        this.userHandlerService.registerStatusEvent.subscribe((status) => {
          this.errorDisplayMessage = errorMessageService.RegisterFailed;
        })
      )
  }

  switchToLogin() : void {
    this.loginMode = true;
    this.errorDisplayMessage = '';
  }

  switchToRegister() : void {
    this.loginMode = false;
    this.errorDisplayMessage = '';
  }

  ngOnInit(): void {
    this.errorDisplayMessage = '';
  }

  ngOnDestroy(): void {
    // Unsubscribe when leaving component
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  login(name, password) {
    // Username length check
    if (name.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginUsernameTooShort;
      return;
    }
    if (password.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginPasswordTooShort;
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
      if (this.loginMode) {
        this.userHandlerService.login(name, password);
      } else {
        this.userHandlerService.register(name, password);
      }
    });
  }
}
