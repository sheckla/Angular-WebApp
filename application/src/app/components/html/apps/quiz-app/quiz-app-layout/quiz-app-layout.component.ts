import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from '../../../../userAuth/services/user-handler.service';
import * as client from '../../../../../../assets/js/quizClient.js'

@Component({
  selector: 'app-quiz-app-layout',
  templateUrl: './quiz-app-layout.component.html',
  styleUrls: ['./quiz-app-layout.component.css']
})
export class QuizAppLayoutComponent implements OnInit {
  userLoggedIn = false;
  username;

  constructor(private userHandlerService: UserHandlerService) {
    this.subscribeUserHandlerService();
  }

  ngOnInit(): void {
  }

  subscribeUserHandlerService() {
    this.userHandlerService.clientName$.subscribe(username => {
      this.username = username;
        if (username.length >= 6) {
          this.userLoggedIn = true;
        } else {
          this.userLoggedIn = false;
        }
    });
  }

  myFunc(): void {
    client.establishSocketConnection();
    client.initOnConnectListeners();
    client.closeSocketConnection();
  }

}
