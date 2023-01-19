import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessagesService {
  LoginUsernameTooShort = 'Please make sure to enter a username with 4+ characters';
  LoginUsernameTaken = 'Username already taken, try a different one';
  loginSuccess = 'Login Successfull!';

  constructor() { }
}
