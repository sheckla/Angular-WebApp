import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Debug } from './util/Debug';
import { ClientSocket } from './util/ClientSocket';
import { User, LobbyInfo, QuizQuestion, Timer, QuestionTopicResult } from './util/QuizAppDataTypes';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from './popupDialog/popup.service';
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
  private _currentLeaderboardUsers: User[] = [];
  private _questionTimer: Timer = new Timer(); // current question timer
  private _questionTopicResult: QuestionTopicResult = new QuestionTopicResult();
  public intermissionTimer: Timer = new Timer(); // intermission timer for specific events
  public leaderboardPolled: boolean = false;
  public questionResultsReceived: boolean = false;

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

  constructor(private popupService: PopupService) {
    this._clientConnection.connectionHasBeenLostEvent.subscribe(() => {
      if (this._clientConnection.connected()) this.popupService.showPopup('Connection Lost!', "Connection was closed unexpectedly", "Damn bruv")
      Debug.log("Oh no! Connection failed. RIP");
      this.resetQuizAppData();
    })
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
      this._openLobbies = openLobbyInfo;
    });

    // Current Leaderboard scores CurrentLeaderboard
    this._clientConnection.getSocket().on('CurrentLeaderboard', (leaderboard) => {
      var leaderboardUsers: any = [];
      for (var i = 0; i < leaderboard.length; i++) {

      }
      this._currentLeaderboardUsers = leaderboard;
      this.leaderboardPolled = true;
      /*       var openLobbyInfo: any = [];
            for (var i = 0; i < lobbyInfos.length; i++) {
              var lobby: LobbyInfo = lobbyInfos[i];
              var info = {
                name: lobby.name,
                users: lobby.users,
              };
              openLobbyInfo.push(info);
            } */
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
        this._user.isInsideLobby = !status.success || !status;
        this._currentLobby.isStarting = !status.success || !status;
        if (status.kick) {
          this.popupService.showPopup("Lobby Leader has closed the lobby!", "You have been returned to the dashboard", "I Understand :sadface:");
        }
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
        this._currentLobby.finished = lobbyInfo.finished;
        this.lobbyInformationChangedEvent.emit(lobbyInfo);

      });

    // Lobby Users changed
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
        this.questionResultsReceived = false;
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
      })

    // Current Lobby Questions results after question time has ended or all users have submitted answer
    this._clientConnection
      .getSocket()
      .on('LobbyQuestionTopicResults', (questionTopicResult) => {
        Debug.log("round finished");
        this._questionTopicResult = questionTopicResult;
        console.log(this._questionTopicResult);
        var users = [this._currentLobby.leader, ...this._currentLobby.users];
        users.forEach((user) => {
          user.answerSubmitted = false;
        })
        this._questionTimer.stop();
        this.questionResultsReceived = true;
      })

    this._clientConnection
      .getSocket()
      .on('LobbyUserHasSubmittedAnswer', (username) => {
        var users = [this._currentLobby.leader, ...this._currentLobby.users];
        users.forEach((user) => {
          if (user.name == username) user.answerSubmitted = true;
        })
      })

    // Current Lobby Game finished
    this._clientConnection
      .getSocket()
      .on('LobbyGameFinished', (status) => {
        this._currentLobby.finished = status;
        this._questionTopicResult = new QuestionTopicResult();
        this.lobbyGameFinishedEvent.emit(true);

        Debug.log("Lobby Game finished, preparing to return to lobby in " + 15 + " seconds.");
        this.intermissionTimer = new Timer();
        this.intermissionTimer.start(5);
        this.intermissionTimer.timerTickEvent.subscribe((tick) => {
          if (tick == 0) {
            Debug.log("returning to lobby");
            this.intermissionTimer.timerTickEvent.unsubscribe();
            this.intermissionTimer.stop();
            this.finishGame();
          }
        })
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
      this.resetQuizAppData();
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
    this._currentLobby.sortedUsers = [this._currentLobby.leader, ...this._currentLobby.users];
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

  getLeaderboard() {
    return this._currentLeaderboardUsers;
  }

  getCurrentOpenLobbies() {
    return this._openLobbies;
  }

  getQuestionTopicResult() {
    return this._questionTopicResult;
  }

  getSortedUsers(): User[] {
    var users = [this._currentLobby.leader, ...this._currentLobby.users];
    users.sort((a: User, b: User) => b.currentScore - a.currentScore);
    return users;
  }

  userHadCorrectAnswer(name: string): boolean {
    var userHadCorrectAnswer = false;
    this._questionTopicResult.userResults.forEach((userResult) => {
      if (userResult.name == name && userResult.addedScore > 0) userHadCorrectAnswer = true;
    });
    return userHadCorrectAnswer;
  }

  getAddedScore(name: string): string {
    var addedScore = '';
    this._questionTopicResult.userResults.forEach((userResult) => {
      if (userResult.name == name) addedScore = userResult.addedScore.toString();
    })
    return addedScore;
  }

  userHadStreakPoints(name: string): boolean {
    var userHadStreakPoints = false;
    this._questionTopicResult.userResults.forEach((userResult) => {
      if (userResult.name == name && userResult.addedStreakScore > 0) userHadStreakPoints = true;
    });
    return userHadStreakPoints;
  }

  getStreakScore(name: string): string {
    var addedStreakScore = '';
    this._questionTopicResult.userResults.forEach((userResult) => {
      if (userResult.name == name) addedStreakScore = userResult.addedStreakScore.toString();
    })
    return addedStreakScore;
  }

  validifyCorrectAnswer(answer: string): boolean {
    var answerCorrect = false;
    if (this._questionTopicResult.correctAnswer == answer) answerCorrect = true;
    return answerCorrect;
  }


  resetQuizAppData() {
    this._user = new User(),
      this._currentLobby = new LobbyInfo();
    this._openLobbies = [];
    this._currentLeaderboardUsers = [];
    this._questionTimer = new Timer();
    this.intermissionTimer = new Timer();
    this.leaderboardPolled = false;
    //this._clientConnection = new ClientSocket();
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
