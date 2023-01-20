import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';
import { ErrorMessagesService } from 'src/app/components/userAuth/services/error-messages.service';
import { Subscription } from 'rxjs';
import { Debug } from 'src/app/components/userAuth/services/util/Debug';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css'],
})
export class QuizDashboardComponent implements OnInit {
  private _subscriptions: Subscription[] = [];
  public statusMessage: string = "";
  lobbies: any = [];

  constructor(public userHandlerService: UserHandlerService,
    private _errorMessageService: ErrorMessagesService) {

    // Lobby Join Event
    this._subscriptions.push(
      this.userHandlerService.lobbyJoinedEvent.subscribe(status => {
        if (status) {
          this.statusMessage = "";
        } else {
          this.statusMessage = _errorMessageService.LobbyJoinError;
        }
      })
    )

    // Lobby Creation Event
    this._subscriptions.push(
      this.userHandlerService.lobbyCreationEvent.subscribe(status => {
        if (status) {
          this.statusMessage = "";
        } else {
          this.statusMessage = _errorMessageService.LobbyCreationError;
        }
      })
    )

    // Fetch current Open Lobbies Event
    this._subscriptions.push(
      this.userHandlerService.openLobbyFetchEvent.subscribe(lobbies => {
        this.lobbies = lobbies;
      })
    )

    //TODO: Must be replaced with data from server
    this.lobbies = [
      {
        name: 'Racewars',
        users: 9,
      },

      {
        name: 'Basic',
        users: 3,
      },
      {
        name: 'Geography',
        users: 9,
      },
      {
        name: 'Skaters-Paradies',
        users: 2,
      },
      {
        name: 'Pornsections',
        users: 10,
      },
      {
        name: 'Series',
        users: 1,
      },

    ];
  }

  ngOnDestroy(): void {
    // Unsubscribe when leaving component
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  createLobby(name: string) {
    if (!this.validateLobbyName(name)) return;
    this.userHandlerService.createLobby(name);
  }

  joinLobby(name: string) {
    if (!this.validateLobbyName(name)) return;
    this.userHandlerService.joinLobby(name);
  }

  logout(): void {
    this.userHandlerService.logout();
  }

  private validateLobbyName(lobbyName: string) : boolean {
    if (lobbyName.length < 4) {
      this.statusMessage = this._errorMessageService.LobbyNameTooShortError;
      return false;
    }
    this.statusMessage = "";
    return true;
  }

  ngOnInit(): void { }
}
