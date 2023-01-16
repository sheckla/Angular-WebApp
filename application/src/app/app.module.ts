import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { IndexComponent } from './components/html/index/index.component';
import { UserLoginComponent } from './components/userAuth/user-login/user-login.component';
import { NavbarComponent } from './components/html/navbar/navbar.component';
import { QuizAppLayoutComponent } from './components/html/apps/quiz-app/quiz-app-layout/quiz-app-layout.component';
import { QuizDashboardComponent } from './components/html/apps/quiz-app/quiz-dashboard/quiz-dashboard.component';
import { QuizLobbyComponent } from './components/html/apps/quiz-app/quiz-lobby/quiz-lobby.component';
import { QuizInGameComponent } from './components/html/apps/quiz-app/quiz-in-game/quiz-in-game.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserLoginComponent,
    IndexComponent,
    QuizAppLayoutComponent,
    QuizDashboardComponent,
    QuizLobbyComponent,
    QuizInGameComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
