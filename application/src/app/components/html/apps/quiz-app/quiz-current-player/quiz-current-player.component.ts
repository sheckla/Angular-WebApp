import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-current-player',
  templateUrl: './quiz-current-player.component.html',
  styleUrls: ['./quiz-current-player.component.css'],
})
export class QuizCurrentPlayerComponent implements OnInit {
  constructor(public userHandlerService: UserHandlerService) {}

  ngOnInit(): void {}
}
