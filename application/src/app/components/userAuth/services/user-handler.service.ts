import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Debug } from './util/Debug';
import { ClientSocket } from './util/ClientSocket';
import { User, LobbyInfo, Quiz, QuizQuestion } from './util/QuizAppDataTypes';
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

  // TODO: We dont know how to handle the Quiz, so its a workarount [24.01.23; mihammer]
  public _quiz: Quiz = new Quiz();
  started: boolean = false;

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
    this.fillQuizForTesting();
    // Debug.log('Switched this.started = true');
    // this.started = true;
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

    this.started = false; //TODO: Remove here

    Debug.log('Leaving Lobby');
    this._clientConnection
      .getSocket()
      .emit('Client_LobbyLeaveRequest', this._currentLobby.name);
  }

  startLobby(): void {
    // TODO: remove also this setting
    this.started = true;

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
    testUser.name = 'PrettyEyebrowsOMG';
    //Filling the lobby
    testLobby.name = 'VerteilteSystemeSux';
    testLobby.leader = 'PrettyEyebrowsOMG';
    testLobby.users = [
      'Robin',
      'Iamvile',
      'S0phus',
      'Gamerbadger',
      'Helixo',
      'Quackster',
      'Goff',
      'Chiseler',
      'Wild Hog',
      'Phantom361',
    ];
    testLobby.category = 'Art';
    testLobby.totalQuestions = 10;
    testLobby.difficulty = 'hard';
    testLobby.started = false;
    //Override
    this._currentLobby = testLobby;
    this._user = testUser;
    Debug.log('Filled lobby for developing');
    Debug.log('Replaced current user by: ' + testUser.name);
    Debug.log('Replaced current lobby by: ' + testLobby.name);
  }

  // *** FILL QUIZ FOR TESTING ONLY ***
  // TODO: Please remove when inGame is ready!
  private fillQuizForTesting() {
    var testQuiz = new Quiz();
    testQuiz.questions = [
      {
        category: 'Entertainment: Cartoon & Animations',
        type: 'multiple',
        difficulty: 'easy',
        question:
          'Who was the villain of &#039;&#039;The Lion King&#039;&#039;?',
        correctAnswer: 'Scar',
        falseAnswers: ['Fred', 'Jafar', 'Vada'],
      },
      {
        category: 'Entertainment: Film',
        type: 'multiple',
        difficulty: 'medium',
        question:
          'Which retired American football quarterback played himself in &#039;Ace Ventura: Pet Detective&#039; and &#039;Little Nicky&#039;?',
        correctAnswer: 'Dan Marino',
        falseAnswers: ['John Elway', 'Tom Brady', 'Joe Montana'],
      },
      {
        category: 'Geography',
        type: 'multiple',
        difficulty: 'medium',
        question: 'Montreal is in which Canadian province?',
        correctAnswer: 'Quebec',
        falseAnswers: ['Ontario', 'Nova Scotia', 'Alberta'],
      },
      {
        category: 'Geography',
        type: 'multiple',
        difficulty: 'medium',
        question: 'What is the largest non-continental island in the world?',
        correctAnswer: 'Greenland',
        falseAnswers: ['New Guinea', 'Borneo', 'Madagascar'],
      },
      {
        category: 'Geography',
        type: 'multiple',
        difficulty: 'easy',
        question: 'What is the capital of Scotland?',
        correctAnswer: 'Edinburgh',
        falseAnswers: ['Glasgow', 'Dundee', 'London'],
      },
      {
        category: 'History',
        type: 'multiple',
        difficulty: 'easy',
        question: 'In 1453, which important city fell?',
        correctAnswer: 'Constantinople',
        falseAnswers: ['Rome', 'Hamburg', 'Athens'],
      },
      {
        category: 'Entertainment: Video Games',
        type: 'boolean',
        difficulty: 'medium',
        question: 'Shang Tsung is a playable character in Mortal Kombat XL.',
        correctAnswer: 'False',
        falseAnswers: ['True'],
      },
      {
        category: 'Science & Nature',
        type: 'boolean',
        difficulty: 'medium',
        question:
          '&quot;Tachycardia&quot; or &quot;Tachyarrhythmia&quot; refers to a resting heart-rate near or over 100 BPM.',
        correctAnswer: 'True',
        falseAnswers: ['False'],
      },
      {
        category: 'Geography',
        type: 'multiple',
        difficulty: 'hard',
        question: 'Which is not a country in Africa?',
        correctAnswer: 'Guyana',
        falseAnswers: ['Senegal', 'Liberia', 'Somalia'],
      },
      {
        category: 'Entertainment: Music',
        type: 'multiple',
        difficulty: 'easy',
        question: 'Who is the lead singer of Foo Fighters?',
        correctAnswer: 'Dave Grohl',
        falseAnswers: [
          'Dave Mustaine',
          'James Hetfield',
          'Little Red Riding Hood',
        ],
      },
    ];
    this._quiz = testQuiz;
    Debug.log('Filled quiz for developing');
    console.log(this._quiz.questions);
  }
}
