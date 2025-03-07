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
  wrongUsernameInput: boolean = false;
  wrongPasswordInput: boolean = false;
  private _subscriptions: Subscription[] = [];

  constructor(
    private userHandlerService: UserHandlerService,
    private errorMessageService: ErrorMessagesService) {
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
      this.shakeButton("nameInput")
      this.errorDisplayMessage = this.errorMessageService.LoginUsernameTooShort;
      return;
    }
    if (password.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginPasswordTooShort;
      this.shakeButton("passwordInput");
      return;
    }

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

  shakeButton(id: any) {
    const button = document.getElementById(id)
    button?.classList.add("btn-wrong-input");
    setTimeout(() => {
      button?.classList.remove('btn-wrong-input');
    }, 500);
  }
}
