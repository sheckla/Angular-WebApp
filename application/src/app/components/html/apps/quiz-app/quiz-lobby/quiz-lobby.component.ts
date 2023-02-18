import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { SettingHandlerService } from 'src/app/components/userAuth/services/setting-handler.service';
import { LobbyInfo } from 'src/app/components/userAuth/services/util/QuizAppDataTypes';
import { PopupService } from 'src/app/components/userAuth/services/popupDialog/popup.service';

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.css'],
})
export class QuizLobbyComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  public statusMessage: string = '';

  // Selected Options for QuizLobby
  public selectedAmount: number = 0;
  public defaultAmount: number = 0;

  public selectedTimer: number = 0;
  public defaultTimer: number = 0;

  public selectedDifficulty: string = '';
  public defaultDifficulty: string = '';

  public selectedCategory: string = '';
  public defaultCategory: string = '';

  constructor(
    public userHandlerService: UserHandlerService,
    public settingHandler: SettingHandlerService,
    private popup: PopupService
  ) {
    // preserve existing values if existing
    if (this.userHandlerService.getLobbyInfo().totalQuestionCount) this.defaultAmount = this.userHandlerService.getLobbyInfo().totalQuestionCount;
    if (this.userHandlerService.getLobbyInfo().maxTimerSeconds) this.defaultTimer = this.userHandlerService.getLobbyInfo().maxTimerSeconds
    if (this.userHandlerService.getLobbyInfo().difficulty) this.defaultDifficulty = this.userHandlerService.getLobbyInfo().difficulty;
    if (this.userHandlerService.getLobbyInfo().categoryName) this.defaultCategory = this.userHandlerService.getLobbyInfo().categoryName;

    // update from lobby info change event
    this._subscriptions.push(
      this.userHandlerService.lobbyInformationChangedEvent.subscribe((info) => {
        // assign default values to default-values from server

        console.log(info);
        this.defaultAmount = info.totalQuestionCount;
        this.defaultTimer = info.maxTimerSeconds;
        this.defaultCategory = info.categoryName;
        // capitalize
        if (info.difficulty) this.defaultDifficulty = info.difficulty.charAt(0).toUpperCase() + info.difficulty.slice(1);
        // assign to current selected values
        this.selectedAmount = this.defaultAmount;
        this.selectedTimer = this.defaultTimer;
        this.selectedCategory = this.defaultCategory;
        this.selectedDifficulty = this.defaultDifficulty
      })
    )
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  leaveLobby(): void {
    if ((this.userHandlerService.getUser().name == this.userHandlerService.getLobbyInfo().leader.name) &&(this.userHandlerService.getLobbyInfo().users && this.userHandlerService.getLobbyInfo().users.length >= 1)) {
      this.popup.showPopupSelectable("Woah Nelly", "Wait Bro, you'll close lobby for others too").afterClosed().subscribe(result => {
        if (result == 'confirm') this.userHandlerService.leaveLobby();
      })
    } else {
      this.userHandlerService.leaveLobby();
    }
  }

  startLobby(): void {
    this.userHandlerService.startLobby(this.selectedTimer, this.selectedAmount,
      this.selectedDifficulty, this.selectedCategory);
  }

  // Buttons are defined via onModelChange => reduce traffic, only call if val changed
  selectAmount(amount: number): void {
    console.log(amount);
    this.selectedAmount = amount;
  }

  selectTimer(timer: number): void {
    console.log(timer);
    this.selectedTimer = timer;
  }

  selectDifficulty(difficulty: string): void {
    console.log(difficulty);
    this.selectedDifficulty = difficulty;
  }

  selectCategory(category: string): void {
    console.log(category);
    this.selectedCategory = category;
  }
}
