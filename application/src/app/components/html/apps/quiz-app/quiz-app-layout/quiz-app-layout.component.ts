import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from '../../../../userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-app-layout',
  templateUrl: './quiz-app-layout.component.html',
  styleUrls: ['./quiz-app-layout.component.css']
})
export class QuizAppLayoutComponent implements OnInit {
  userLoggedIn = false;


  constructor(private userHandlerService: UserHandlerService) {
    this.subscribeUserHandlerService();

  }

  ngOnInit(): void {

  }

  subscribeUserHandlerService() {
    this.userHandlerService.loggedIn$.subscribe(loggedIn => {
      this.userLoggedIn = loggedIn;
    });
  }


}
