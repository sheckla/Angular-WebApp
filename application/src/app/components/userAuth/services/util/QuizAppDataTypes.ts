import { EventEmitter } from "@angular/core";

export class User {
  public name: string = '';
  public isLoggedIn: boolean = false;
  public isInsideLobby: boolean = false;
  public currentScore: number = 0;
  public currentWrongAnswers: number = 0;
  public currentCorrectAnswers: number = 0;
  public currentStreak: number = 0;
  public answerSubmitted: boolean = false;
  public totalScore: number = 0;
  public totalPlayedGames: number = 0;
}

export class LobbyInfo {
  public name: string = '';
  public leader: User = new User();
  public users: User[] = []; // All current Users in Lobby (joined + leader)
  public categoryName: string = '';
  public totalQuestionCount: number = 0;
  public difficulty: string = '';
  public maxTimerSeconds: number = 0;
  public started: boolean = false;
  public currentQuestionTopic: QuizQuestion = new QuizQuestion();
  public finished: boolean = false;
  public isStarting: boolean = false;
}

// Same interface as requested from opentdb
export class QuizQuestion {
  public question: string = '';
  public category: string = '';
  public type: string = '';
  public difficulty: string = '';
  public shuffledAnswers: string[] = [];
  public index: number = 0;
}

export class Timer {
  public timerFinishedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public timerTickEvent: EventEmitter<number> = new EventEmitter<number>();
  public maxTimer: number = 30;
  public currentTimer: number = 0;
  private _timerDelta = 1000;
  private _intervalID: any;

  constructor() {
  }

  start(maxTimer: number) {
    this.maxTimer = maxTimer;
    clearInterval(this._intervalID);
    this.currentTimer = this.maxTimer
    this.timerTickEvent.emit(this.currentTimer);
    this._intervalID = setInterval(() => {
      this.currentTimer--;
      this.timerTickEvent.emit(this.currentTimer);
      if (this.currentTimer === 0) {
        clearInterval(this._intervalID);
        this.timerFinishedEvent.emit(true);
      }
    }, this._timerDelta)
  }

  stop() {
    clearInterval(this._intervalID);
    this.currentTimer = this.maxTimer;
  }

  restart() {
    this.stop();
    this.start(this.maxTimer);
  }
}
