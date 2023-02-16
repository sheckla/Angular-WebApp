import { Component, OnInit } from '@angular/core';
import { ErrorMessagesService } from 'src/app/components/userAuth/services/error-messages.service';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-quiz-register',
  templateUrl: './quiz-register.component.html',
  styleUrls: ['./quiz-register.component.css']
})
export class QuizRegisterComponent implements OnInit {
  errorDisplayMessage = '';
  constructor(
    private userHandlerService: UserHandlerService,
    private errorMessageService: ErrorMessagesService
  ) {
  }

  ngOnInit(): void {
  }


  register(name, password) {
    if (name.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginUsernameTooShort;
      return;
    }
    if (password.length < 4) {
      this.errorDisplayMessage = this.errorMessageService.LoginPasswordTooShort;
      return;
    }
    this.userHandlerService.getClientSocket().establishConnection().then(() => {
      this.userHandlerService.initQuizGameListeners();
      this.userHandlerService.register(name, password);
    });
  }
}
