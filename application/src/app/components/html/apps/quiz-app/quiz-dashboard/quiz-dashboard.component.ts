import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-dashboard',
  templateUrl: './quiz-dashboard.component.html',
  styleUrls: ['./quiz-dashboard.component.css'],
})
export class QuizDashboardComponent implements OnInit {
  lobbies: any = [];

  constructor(private userHandlerService: UserHandlerService) {
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

  //username = this.userHandlerService.getUsername();
  username = 'QuizMaster1239';

  ngOnInit(): void {}
}
