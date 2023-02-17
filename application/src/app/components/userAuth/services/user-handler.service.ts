import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Debug } from './util/Debug';
import { ClientSocket } from './util/ClientSocket';
import { User, LobbyInfo, QuizQuestion, Timer } from './util/QuizAppDataTypes';
import { DomSanitizer } from '@angular/platform-browser';
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
  private _questionTimer: Timer = new Timer(); // current question timer
  public intermissionTimer: Timer = new Timer(); // intermission timer for specific events

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
  public loginStatusEvent = new EventEmitter<boolean>();
  public registerStatusEvent = new EventEmitter<boolean>();
  public lobbyJoinedEvent = new EventEmitter<boolean>(); // status for successful lobby join
  public lobbyCreationEvent = new EventEmitter<boolean>(); // status for successful lobby creation
  public openLobbyFetchEvent = new EventEmitter<any[]>(); // lobby info for current open lobbies
  public lobbyInformationChangedEvent = new EventEmitter<LobbyInfo>(); // lobby info if current lobby info changed
  public lobbyQuestionChangedEvent = new EventEmitter<any>(); // status if current lobby question changed
  public lobbyGameFinishedEvent = new EventEmitter<boolean>(); // status if current game is finished

  constructor() {

  }

  // Socket Listeners for Quiz-Game Client<->Server communication
  initQuizGameListeners() {

    // Login Status
    this._clientConnection
      .getSocket()
      .on('Client_LoginRequest_Status', (status) => {
        this._user.isLoggedIn = status.success;
        this.loginStatusEvent.emit(status.success);
        if (status.success) {
          this._user.totalScore = status.totalScore;
          this._user.totalPlayedGames = status.totalPlayedGames;
        }
      });

    // Register Status
    this._clientConnection
      .getSocket()
      .on('Client_RegisterRequest_Status', (status) => {
        this._user.isLoggedIn = status;
        this.registerStatusEvent.emit(status);
      });

    // Current Open Lobbies
    this._clientConnection.getSocket().on('CurrentOpenLobbies', (lobbyInfos) => {
      var openLobbyInfo: any = [];
      for (var i = 0; i < lobbyInfos.length; i++) {
        var lobby: LobbyInfo = lobbyInfos[i];
        var info = {
          name: lobby.name,
          users: lobby.users,
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
        console.log(this._currentLobby);
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
        this._user.isInsideLobby = !status;
        this._currentLobby.isStarting = !status;
      });

    // Lobby Information Status
    this._clientConnection
      .getSocket()
      .on('CurrentLobbyInformationChanged', (lobbyInfo) => {
        this._currentLobby.name = lobbyInfo.name
        this._currentLobby.totalQuestionCount = lobbyInfo.totalQuestionCount;
        this._currentLobby.categoryName = lobbyInfo.categoryName;
        this._currentLobby.difficulty = lobbyInfo.difficulty;
        this._currentLobby.started = lobbyInfo.started;
        this._currentLobby.maxTimerSeconds = lobbyInfo.maxTimerSeconds;
        this.lobbyInformationChangedEvent.emit(lobbyInfo);

      });

    // Lobby Start Request Status
    this._clientConnection
    .getSocket()
    .on('CurrentLobbyUserInfoUpdate', (userInfo) => {
      this._currentLobby.leader = userInfo.leader;
      this._currentLobby.users = userInfo.users;

      if (userInfo.leader.name == this._user.name) {
        this._user.currentCorrectAnswers = userInfo.leader.currentCorrectAnswers;
        this._user.currentWrongAnswers = userInfo.leader.currentWrongAnswers;
        this._user.currentScore = userInfo.leader.currentScore;
        return;
      }

      userInfo.users.forEach(user => {
        if (user.name == this._user.name) {
          this._user.currentCorrectAnswers = user.currentCorrectAnswers;
          this._user.currentWrongAnswers = user.currentWrongAnswers;
          this._user.currentScore = user.currentScore;
          return;
        }
      })

    })

    // Current Lobby Question
    this._clientConnection
    .getSocket()
    .on('CurrentLobbyQuestion', (question) => {
      this._currentLobby.currentQuestionTopic.question = question.question;
      this._currentLobby.currentQuestionTopic.category = question.category;
      this._currentLobby.currentQuestionTopic.type = question.type;
      this._currentLobby.currentQuestionTopic.difficulty = question.difficulty;
      this._currentLobby.currentQuestionTopic.shuffledAnswers = question.shuffledAnswers;
      this._currentLobby.currentQuestionTopic.index = question.index;
      this._questionTimer.stop();
      this._questionTimer.start(this._currentLobby.maxTimerSeconds);
      if (question.timerForLateJoinedUser) {
        this._questionTimer.currentTimer = question.timerForLateJoinedUser;
      }
      this.lobbyQuestionChangedEvent.emit();
      console.log(this._currentLobby);
    })

    // current lobby timer

    // Current Lobby Users info changed
    this._clientConnection
    .getSocket()
    .on('CurrentLobbyQuestionFinished', (lobbyInfo) => {
      Debug.log("round finished");
    })

    // Current Lobby Game finished
    this._clientConnection
    .getSocket()
    .on('LobbyGameFinished', (status) => {
      this._currentLobby.finished = status;
      this.lobbyGameFinishedEvent.emit(true);
    })

  }

  // *** Emit Events
  login(name: string, password: string) {
    Debug.log('Username: ' + name + ' login-request sent to server');
    var userPass = {
      name: name,
      password: password,
    }
    this._user.name = name;
    this._clientConnection.getSocket().emit('Client_LoginRequest', userPass);
  }

  register(name: string, password: string) {
    Debug.log('Username: ' + name + ' register request sent to server');
    var userPass = {
      name: name,
      password: password,
    }
    this._user.name = name;
    this._clientConnection.getSocket().emit('Client_RegisterRequest', userPass);
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

  startLobby(timer: number, amount: number, difficulty: string, category: string): void {
    this._currentLobby.maxTimerSeconds = timer;
    this._currentLobby.totalQuestionCount = amount;
    this._currentLobby.difficulty = difficulty;
    this._currentLobby.categoryName = category;

    var lobbySettings = {
      name: this._currentLobby.name,
      maxTimerSeconds: timer,
      totalQuestionsAmount: amount,
      difficulty: difficulty,
      category: category,
    }
    this._currentLobby.isStarting = true;
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyStartRequest', lobbySettings);
  }

  // TODO submit answer as int[0,3] to save data
  submitAnswer(answer: string): void {
    this._clientConnection.getSocket().emit('Client_SubmitAnswer', answer);
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

  getQuestionTimer(): Timer {
    return this._questionTimer;
  }

  resetQuizGameStatus() {
    this._user = new User(),
    this._currentLobby = new LobbyInfo();
    this._clientConnection = new ClientSocket();
  }

  finishGame(): void {
    this._user.currentScore = 0;
    this._user.answerSubmitted = false;
    this._user.currentStreak = 0;
    this._user.currentWrongAnswers = 0;
    this._user.currentCorrectAnswers = 0;

    this._currentLobby.started = false;
    this._currentLobby.isStarting = false;
    this._currentLobby.leader.currentScore = 0;
    this._currentLobby.leader.answerSubmitted = false;
    this._currentLobby.leader.currentStreak = 0;
    this._currentLobby.leader.currentWrongAnswers = 0;
    this._currentLobby.leader.currentCorrectAnswers = 0;

    this._currentLobby.users.forEach(user => {
      user.currentScore = 0;
      user.answerSubmitted = false;
      user.currentStreak = 0;
      user.currentWrongAnswers = 0;
      user.currentCorrectAnswers = 0;
    })
  }
}
