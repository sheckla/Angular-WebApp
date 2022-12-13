import { Component, OnInit } from '@angular/core';
import { UserHandlerService } from 'src/app/components/drawAppPage/services/user-handler.service';

@Component({
  selector: 'app-draw-app-layout',
  templateUrl: './draw-app-layout.component.html',
  styleUrls: ['./draw-app-layout.component.css']
})
export class DrawAppLayoutComponent implements OnInit {
  userLoggedIn = false;
  title: any = 'OOAD'

  constructor(private userHandlerService: UserHandlerService){
    this.subscribeToUserHandlerService();
  }

  subscribeToUserHandlerService() {
    this.userHandlerService.clientName$.subscribe(userName => {
      if (userName.length >=4) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  ngOnInit(): void {
  }
}
