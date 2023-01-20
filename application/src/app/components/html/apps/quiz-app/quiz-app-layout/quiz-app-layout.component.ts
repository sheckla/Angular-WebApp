import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from '../../../../userAuth/services/user-handler.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-app-layout',
  templateUrl: './quiz-app-layout.component.html',
  styleUrls: ['./quiz-app-layout.component.css']
})
export class QuizAppLayoutComponent implements OnInit {
  constructor(public userHandlerService: UserHandlerService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
