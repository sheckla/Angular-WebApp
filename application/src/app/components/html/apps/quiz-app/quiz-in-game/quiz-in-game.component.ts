import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-in-game',
  templateUrl: './quiz-in-game.component.html',
  styleUrls: ['./quiz-in-game.component.css'],
})
export class QuizInGameComponent implements OnInit {
  constructor(public userHandlerService: UserHandlerService) {}

  ngOnInit(): void {}
}
