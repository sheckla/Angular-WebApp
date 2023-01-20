import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})

//This service will be an interface to the Client, which is written in JavaScript
//We will also implements an observerable ConnectedStatus
export class UserHandlerService {
  // Socket infos
  private socket;
  private host = "ws://localhost:3000";
  private connected = false;

  // Connection Status infos
  public loggedIn;
  public insideLobby;

  // Quiz Game Info
  public username;

  // Lobby info
  public lobbyName;
  public totalQuestionCount;
  public categoryName;
  public difficulty;
  public leader;
  public usernamesInLobby;

  public loginEventStatus = new EventEmitter<boolean>();
  public lobbyCreationEventStatus = new EventEmitter<boolean>();
  public lobbyJoinEventStatus = new EventEmitter<boolean>();
  public lobbyInformationChangedEventStatus = new EventEmitter<any>();

  constructor() { }

  getConnected() {
    return this.connected;
  }

  getUsername() {
    return this.username;
  }

  establishSocketConnection() {
    this.socket = io(this.host, {
      transports: ["websocket"],
    });
  }

  // Socket Listener
  initOnConnectListeners() {
    this.socket.on("connect", () => {
      // Set connection to true - Client can check if still connected;
      this.connected = true;
      console.log("Connection: Established, SockedID = " + this.socket.id);

      // Login Status
      this.socket.on("Client_SendUsername_Status", (status) => {
        this.loggedIn = status;
        this.loginEventStatus.emit(status);
      })

      // Lobby Creation Status
      this.socket.on("Client_LobbyCreationRequest_Status", (status) => {
        this.insideLobby = status;
        this.lobbyCreationEventStatus.emit(status);
      });

      // Lobby Join Status
      this.socket.on("Client_LobbyJoinRequest_Status", (status) => {
        this.insideLobby = status;
        this.lobbyJoinEventStatus.emit(status);
      })

      // Lobby Information Status
      this.socket.on("LobbyInformationChanged", (info) => {
        this.lobbyName = info.lobbyName;
        this.totalQuestionCount = info.totalQuestionCount;
        this.categoryName = info.categoryName;
        this.difficulty = info.difficulty;
        this.leader = info.leader.name;
        this.usernamesInLobby = info.users;
        this.lobbyInformationChangedEventStatus.emit(info);
      })

      // Receive Listener:  Disconnect
      this.socket.on("disconnect", (arg) => {
        console.log("Local client disconnects" + arg);
        this.connected = false;
      });
    });

    // Socket Connection failed
    this.socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  login(name: string) {
    this.socket.emit("Client_SendUsername", name);
    this.username = name;
  }

  createLobby(lobbyName: string) {
    this.socket.emit("Client_LobbyCreationRequest", lobbyName);
    this.lobbyName = lobbyName;
  }

  joinLobby(lobbyName: string) {
    this.socket.emit("Client_LobbyJoinRequest", lobbyName);
  }

}


