import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from '../../../../userAuth/services/user-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-app-layout',
  templateUrl: './quiz-app-layout.component.html',
  styleUrls: ['./quiz-app-layout.component.css']
})
export class QuizAppLayoutComponent implements OnInit {
  private loginEventSubscription;
  public loggedIn;

  constructor(private userHandlerService: UserHandlerService) {
    this.loggedIn = userHandlerService.loggedIn;
  }

  ngOnInit(): void {
    this.loginEventSubscription =
      this.userHandlerService.loginEventStatus.subscribe(status => {
      this.loggedIn = this.userHandlerService.loggedIn;
    })
  }

  ngOnDestroy(): void {
    this.loginEventSubscription.unsubscribe();
  }
}
