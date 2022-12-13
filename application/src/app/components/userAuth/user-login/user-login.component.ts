import { Component} from '@angular/core';
import { UserHandlerService } from 'src/app/components/userAuth/services/user-handler.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  errorDisplayMessage = '';

  constructor(private userHandlerService: UserHandlerService){
  }

  registerAsGuest() {
    this.userHandlerService.updateClientName("Guest" + Math.floor(Math.random() * 2500));
  }

  registerWithName(userName, password) {
    password = "123456"
    if (userName.length >= 3 && password.length >= 6) {
      this.userHandlerService.updateClientName(userName);
    } else if (password.length <= 5) {
      this.errorDisplayMessage = "Password too short (6 Characters)";
    } else {
      this.errorDisplayMessage = "Name too short (4+ Characters)";
    }
  }
}
