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
  public currentSpinnerProgress: number = 25;
  public selectedAnswer: string = '';
  public answerisSelected: boolean = false;
  public answerIconPaths: string[] = [];


  constructor(public userHandlerService: UserHandlerService,
    private sanitizer: DomSanitizer) {
    // *** Subscriptions ***
    this._subscriptions.push(
      // Timer for each new question
      this.userHandlerService.lobbyQuestionChangedEvent.subscribe(() => {
        this.answerisSelected = false;
        this.selectedAnswer = '';
      })
    )
    // Update Spinner for timer-tick or leave lobby if game is finished
    this._subscriptions.push(
      this.userHandlerService.getQuestionTimer().timerTickEvent.subscribe((tick) => {
        this.currentSpinnerProgress = tick / this.userHandlerService.getQuestionTimer().maxTimer * 100;
      })
    )
  }

  ngOnInit(): void {
    this.initAnswerIconPaths();
  }

  ngOnDestroy(): void {
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

}
