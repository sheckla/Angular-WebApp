import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Debug } from 'src/app/components/userAuth/services/util/Debug';

@Component({
  selector: 'app-quiz-in-game',
  templateUrl: './quiz-in-game.component.html',
  styleUrls: ['./quiz-in-game.component.css'],
})
export class QuizInGameComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  public currentTimer: number = 0;
  private _maxCurrentTimer: number = 0;
  public currentSpinnerProgress: number = 25;
  public selectedAnswer: string = '';
  public answerisSelected: boolean = false;
  public answerIconPaths: string[] = [];
  public finished: boolean = false;

  private _timerDelta: number = 1000; // in ms, defines udpate rate
  private _intervalID: any;
  private _timerFinishedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public userHandlerService: UserHandlerService,
    private sanitizer: DomSanitizer) {
      this._maxCurrentTimer = this.userHandlerService.getLobbyInfo().maxTimerSeconds;
      // Restard Timer each time a new question is received (local timer)
      this._subscriptions.push(
          this.userHandlerService.lobbyQuestionChangedEvent.subscribe((status) => {
          if (status) {
            this.startTimer();
            this.answerisSelected = false;
          }
        })
      )
      this._subscriptions.push(
        this.userHandlerService.lobbyGameFinishedEvent.subscribe((status) => {
          this._maxCurrentTimer = 15;
          this.startTimer();
          Debug.log("Lobby Game finished, preparing to return to lobby in " + this._maxCurrentTimer + " seconds.");
          this.finished = true;
        })
      )

      this._subscriptions.push(
        this._timerFinishedEvent.subscribe((status) => {
          Debug.log("Returning to Lobby")
          this.userHandlerService.finishGame();
        })
      )
    }

  ngOnInit(): void {
    this.initAnswerIconPaths();
  }

  ngOnDestroy() : void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private initAnswerIconPaths(): void {
    for (var i = 0; i <= 3; i++) {
      this.answerIconPaths[i] = '../../../../../../assets/img/answer_icon_' + i + '.png';
    }
  }

  // Convert sanitized HTML-Text to pure HTML
  // ** Only use then trusting the received HTML! ***
  sanitizeDom(text) {
    text = this.sanitizer.bypassSecurityTrustHtml(text);
    return text;
  }

  submitAnswer(answer: string): void {
    this.answerisSelected = true;
    this.userHandlerService.submitAnswer(answer);
  }

  startTimer() {
    clearInterval(this._intervalID);
    this.currentTimer = this._maxCurrentTimer;
    this.currentSpinnerProgress = 100;
    this._intervalID = setInterval(() => {
      this.currentTimer--;
      this.currentSpinnerProgress = this.currentTimer / this._maxCurrentTimer * 100;
      if (this.currentTimer === 0) {
        clearInterval(this._intervalID);
        this.currentSpinnerProgress = 0;
        if (this.finished) this._timerFinishedEvent.emit(true);
      }
      }, this._timerDelta)
    }
}
