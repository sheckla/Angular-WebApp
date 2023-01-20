import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {
  LoginUsernameTooShort = 'Please make sure to enter a minimum of 4 characters.';
  LoginUsernameTaken = 'Username already taken, try a different one.';
  LobbyJoinError = 'Lobby doesn\'t exist';
  LobbyCreationError = 'Lobby already exists';
  LobbyNameTooShortError = 'Minimum of 4 Characters for Lobbyname pls bro.';
  loginSuccess = 'Login Successfull!';

  constructor() { }
}
