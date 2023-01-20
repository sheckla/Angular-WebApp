import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
//Nein ich will aber dieses Kommentar
@Injectable({
  providedIn: 'root',
})

//This service will be an interface to the Client, which is written in JavaScript
//We will also implements an observerable ConnectedStatus
export class UserHandlerService {
  // Socket infos
  private socket;
  private host = 'ws://localhost:3000';
  private connected = false;

  // Connection Status infos
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public loggedIn$: Observable<boolean> = this.loggedIn.asObservable();
  private username;

  setLoginStatus(loginStatus) {
    this.loggedIn.next(loginStatus);
  }

  getConnected() {
    return this.connected;
  }

  getUsername() {
    return this.username;
  }

  establishSocketConnection() {
    this.socket = io(this.host, {
      transports: ['websocket'],
    });
  }

  initOnConnectListeners() {
    this.socket.on('connect', () => {
      // Set connection to true - Client can check if still connected;
      this.connected = true;
      console.log('Connection: Established, SockedID = ' + this.socket.id);

      // Receive Listener:  Disconnect
      this.socket.on('disconnect', (arg) => {
        console.log('Local client disconnects' + arg);
        this.connected = false;
      });
    });

    // Socket Connection failed
    this.socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  login(name: string) {
    console.log('Username: ' + name + ' send to server.');
    this.socket.emit('Client_SendUsername', name);
    this.socket.on('Client_SendUsername_Status', (arg) => {
      if (arg) {
        this.setLoginStatus(true);
        console.log('Status: Login accepted');
        this.username = name;
      } else {
        this.setLoginStatus(false);
        console.error('Status: Login rejeted, User already logged in.');
      }
    });
  }

  logout() {
    this.socket.disconnect();
    this.setLoginStatus(false);
  }

  constructor() {}
}
