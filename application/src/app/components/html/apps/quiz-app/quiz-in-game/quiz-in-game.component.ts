import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { Subscription } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Debug } from 'src/app/components/userAuth/services/util/Debug';
import { TimerService } from 'src/app/components/userAuth/services/timer.service';

@Component({
  selector: 'app-quiz-in-game',
  templateUrl: './quiz-in-game.component.html',
  styleUrls: ['./quiz-in-game.component.css'],
})
export class QuizInGameComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  public currentSpinnerProgress: number = 25;
  public selectedAnswer: string = '';
  public answerisSelected: boolean = false;
  public answerIconPaths: string[] = [];


  constructor(public userHandlerService: UserHandlerService,
    public timerService: TimerService,
    private sanitizer: DomSanitizer) {
    // *** Subscriptions ***
    this._subscriptions.push(
      // Timer for each new question
      this.userHandlerService.lobbyQuestionChangedEvent.subscribe((status) => {
        if (status) {
          this.currentSpinnerProgress = 100;
          this.timerService.stopTimer();
          this.timerService.startTimer(this.userHandlerService.getLobbyInfo().maxTimerSeconds);
          this.answerisSelected = false;
        }
      })
      )

      // time accurate timer representation
      this._subscriptions.push(
        this.userHandlerService.lobbyTimerReceivedEvent.subscribe((timer) => {
          this.currentSpinnerProgress = timer / this.userHandlerService.getLobbyInfo().maxTimerSeconds * 100;
      })
    )
    // Return to Lobby after game finish
    this._subscriptions.push(
      this.userHandlerService.lobbyGameFinishedEvent.subscribe((status) => {
        this.timerService.stopTimer(),
          this.timerService.startTimer(15);
        Debug.log("Lobby Game finished, preparing to return to lobby in " + 15 + " seconds.");
      })
    )
    // Update Spinner for timer-tick or leave lobby if game is finished
    this._subscriptions.push(
      this.timerService.timerTickEvent.subscribe((tick) => {
        this.currentSpinnerProgress = tick / this.timerService.maxTimer * 100;
        if (userHandlerService.getLobbyInfo().finished && tick == 0) {
          Debug.log("Returning to lobby");
          this.userHandlerService.finishGame();
        }
      })
    )
  }

  startQuestionTimer(time: number): void {
    this.timerService.stopTimer();
    this.timerService.startTimer(time);
    this.answerisSelected = false;
  }

  ngOnInit(): void {
    this.initAnswerIconPaths();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.timerService.stopTimer();
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

}
