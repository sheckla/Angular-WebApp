import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {
  LoginUsernameTooShort = 'Please make sure to enter a minimum of 4 characters for the username.';
  LoginPasswordTooShort = 'Please make sure to enter a minimum of 4 characters for the password.';
  LoginUsernameTaken = 'Username already taken, try a different one.';
  LoginFailed = 'Login failed! Please check username and password. User may also already be logged in.'
  RegisterFailed = 'Registration failed! Name is already taken.'
  LobbyJoinError = 'Lobby doesn\'t exist';
  LobbyCreationError = 'Lobby already exists';
  LobbyNameTooShortError = 'Minimum of 4 Characters for Lobbyname pls bro.';
  loginSuccess = 'Login Successfull!';

  constructor() { }
}
