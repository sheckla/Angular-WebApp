import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { ErrorMessagesService } from 'src/app/components/userAuth/services/error-messages.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css']
})
export class QuizDashboardComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  public insideLobby: boolean = false;
  public statusMessage: string = "";

  constructor(public userHandlerService: UserHandlerService,
    private errorMessageService: ErrorMessagesService) {
    this.insideLobby = userHandlerService.insideLobby;
  }

  ngOnInit(): void {
    // Lobby Creation Listener
    this.subscriptions.push(
      this.userHandlerService.lobbyCreationEventStatus.subscribe(status => {
        this.insideLobby = this.userHandlerService.insideLobby;
        if (!status) {
          this.statusMessage = this.errorMessageService.LobbyCreationError;
        }
      })
    )

    // Lobby Join Listener
    this.subscriptions.push(
      this.userHandlerService.lobbyJoinEventStatus.subscribe(status => {
        this.insideLobby = this.userHandlerService.insideLobby;
        if (!status) {
          this.statusMessage = this.errorMessageService.LobbyJoinError;
        }
      })
    )
  }

  ngOnDestroy(): void {
    // Unsubscribe when leaving component
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createLobby(name: string) {
    if (name.length < 4) {
      this.statusMessage = this.errorMessageService.LobbyNameTooShortError;
      return;
    }
    this.userHandlerService.createLobby(name);
  }

  joinLobby(name: string) {
    if (name.length < 4) {
      this.statusMessage = this.errorMessageService.LobbyNameTooShortError;
      return;
    }
    this.userHandlerService.joinLobby(name);
  }

}
