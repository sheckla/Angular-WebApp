import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-lobby',
  templateUrl: './quiz-lobby.component.html',
  styleUrls: ['./quiz-lobby.component.css']
})
export class QuizLobbyComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public statusMessage: string = "";

  constructor(public userHandlerService: UserHandlerService) {
   }

  ngOnInit(): void {
    this.subscriptions.push(
      this.userHandlerService.lobbyInformationChangedEventStatus.subscribe(info => {
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
