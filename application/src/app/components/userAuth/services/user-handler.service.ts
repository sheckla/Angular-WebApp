import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Debug } from './util/Debug';
import { ClientSocket } from './util/ClientSocket';
import { User, LobbyInfo } from './util/QuizAppDataTypes';
@Injectable({
  providedIn: 'root',
})
/*
 * UserHandlerService:
 * - This service will be an connection-interface for the Client to Server communication
 * - Status Events will be provided by subscribeable EventEmitters
 * - Saves information regarding aspects of the quiz-game (User, Lobby, Questions ...)
 */
export class UserHandlerService {
  private _clientConnection: ClientSocket = new ClientSocket();
  private _user: User = new User();
  private _currentLobby: LobbyInfo = new LobbyInfo();
  private _openLobbies: LobbyInfo[] = [];

  /*
   * Subscribeable EventEmitters:
   * - be notified when the client-socket receives an answer from the server
   * - Event must be first emitted inside UserHanderService
   *
   * Example:
   *   this.userHandlerService.loginEventStatus.subscribe(statusBoolean => {
   *    // callback - do stuff here when Event happens
   *    })
   */
  public lobbyJoinedEvent = new EventEmitter<boolean>();
  public lobbyCreationEvent = new EventEmitter<boolean>();
  public openLobbyFetchEvent = new EventEmitter<any[]>();

  constructor() {
    // TODO: PLEASE REMOVE WHEN LOGIN SCREEN IS FINISHED
    this.fillLobbyForTesting();
  }

  // Socket Listeners for Quiz-Game Client<->Server communication
  initQuizGameListeners() {
    // Login Status
    this._clientConnection
      .getSocket()
      .on('Client_SendUsername_Status', (status) => {
        this._user.isLoggedIn = status;
      });

    // Current Open Lobbies
    this._clientConnection.getSocket().on('CurrentOpenLobbies', (lobbies) => {
      var openLobbyInfo: any = [];
      for (var i = 0; i < lobbies.length; i++) {
        var lobby: LobbyInfo = this.parseLobbyInfo(lobbies[i]);
        var info = {
          name: lobby.name,
          users: lobby.users.length + 1, // (leader)
        };
        openLobbyInfo.push(info);
      }
      this.openLobbyFetchEvent.emit(openLobbyInfo);
    });

    // Lobby Creation Status
    this._clientConnection
      .getSocket()
      .on('Client_LobbyCreationRequest_Status', (status) => {
        this._user.isInsideLobby = status;
        this.lobbyCreationEvent.emit(status);
      });

    // Lobby Join Status
    this._clientConnection
      .getSocket()
      .on('Client_LobbyJoinRequest_Status', (status) => {
        this._user.isInsideLobby = status;
        this.lobbyJoinedEvent.emit(status);
      });

    // Lobby Leave Status
    this._clientConnection
      .getSocket()
      .on('Client_LobbyLeaveRequest_Status', (status) => {
        if (status == true) {
          this._user.isInsideLobby = false;
        } else {
          this._user.isInsideLobby = true;
        }
      });

    // Lobby Information Status
    this._clientConnection
      .getSocket()
      .on('CurrentLobbyInformationChanged', (info) => {
        this._currentLobby = this.parseLobbyInfo(info);
      });

    // Question Topic Status
    this._clientConnection
      .getSocket()
      .on('Client_RequestQuestionTopics_Status', (questions) => {
        console.log(questions);
      });
  }

  // *** Emit Events
  login(name: string) {
    Debug.log('Username: ' + name + ' login-request sent to server');
    this._clientConnection.getSocket().emit('Client_SendUsername', name);
    this._user.name = name;
  }

  logout(): void {
    if (this._user.isLoggedIn && this._clientConnection.closeConnection()) {
      this.resetQuizGameStatus();
    }
  }

  createLobby(lobbyName: string) {
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyCreationRequest', lobbyName);
  }

  joinLobby(lobbyName: string) {
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyJoinRequest', lobbyName);
  }

  leaveLobby(): void {
    if (this._currentLobby.name == '') return;
    Debug.log('Leaving Lobby');
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyLeaveRequest', this._currentLobby.name);
  }

  startLobby(): void {
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyStartRequest', this._currentLobby.name); //TODO
    this._clientConnection
      .getSocket()
      .emit('Client_RequestQuestionTopics', this._currentLobby.name);
  }

  // *** Getters
  getUser(): User {
    return this._user;
  }

  getLobbyInfo(): LobbyInfo {
    return this._currentLobby;
  }

  getClientSocket(): ClientSocket {
    return this._clientConnection;
  }

  // *** Helper functions
  private parseLobbyInfo(info: any): LobbyInfo {
    var lobbyInfo: LobbyInfo = new LobbyInfo();
    lobbyInfo.name = info.name;
    lobbyInfo.totalQuestions = info.totalQuestionCount;
    lobbyInfo.category = info.categoryName;
    lobbyInfo.difficulty = info.difficulty;
    lobbyInfo.leader = info.leader;
    lobbyInfo.users = info.users;
    return lobbyInfo;
  }

  private resetQuizGameStatus(): void {
    this._user = new User();
    this._clientConnection = new ClientSocket();
    this._currentLobby = new LobbyInfo();
  }

  // *** FILL LOBBY FOR TESTING ONLY ***
  // TODO: PLEASE REMOVE WHEN LOGIN SCREEN IS FINISHED
  private fillLobbyForTesting() {
    var testLobby = new LobbyInfo();
    var testUser = new User();
    //Filling half of User
    testUser.name = 'Jeff';
    //Filling the lobby
    testLobby.name = 'Testos Teron Lobby';
    testLobby.leader = 'Mike';
    testLobby.users = ['mike', 'daniel', 'steve', 'max', 'liz22', 'heiko'];
    testLobby.category = 'Art';
    testLobby.totalQuestions = 10;
    testLobby.difficulty = 'hard';
    testLobby.started = false;
    //Override
    this._currentLobby = testLobby;
    this._user = testUser;
  }
}
