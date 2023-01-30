import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from '../../../../userAuth/services/user-handler.service';
import { Subscription } from 'rxjs';
import { Debug } from 'src/app/components/userAuth/services/util/Debug';

@Component({
  selector: 'app-quiz-app-layout',
  templateUrl: './quiz-app-layout.component.html',
  styleUrls: ['./quiz-app-layout.component.css']
})
export class QuizAppLayoutComponent implements OnInit {
  public debugEnabled: boolean;

  constructor(public userHandlerService: UserHandlerService) {
    this.debugEnabled = Debug.enabled();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
