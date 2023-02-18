import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule } from '@angular/material/icon'

import { MatSliderModule } from '@angular/material/slider';
import { IndexComponent } from './components/html/index/index.component';
import { UserLoginComponent } from './components/userAuth/user-login/user-login.component';
import { NavbarComponent } from './components/html/navbar/navbar.component';
import { QuizAppLayoutComponent } from './components/html/apps/quiz-app/quiz-app-layout/quiz-app-layout.component';
import { QuizDashboardComponent } from './components/html/apps/quiz-app/quiz-dashboard/quiz-dashboard.component';
import { QuizLobbyComponent } from './components/html/apps/quiz-app/quiz-lobby/quiz-lobby.component';
import { QuizInGameComponent } from './components/html/apps/quiz-app/quiz-in-game/quiz-in-game.component';
import { QuizRegisterComponent } from './components/html/apps/quiz-app/quiz-register/quiz-register.component';
import { QuizCurrentPlayerComponent } from './components/html/apps/quiz-app/quiz-current-player/quiz-current-player.component';
import { ImpressumComponent } from './components/html/impressum/impressum.component';


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
        QuizRegisterComponent,
        QuizCurrentPlayerComponent,
        ImpressumComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatIconModule,
        FormsModule,
        MatSliderModule,
        CommonModule,
    ]
})
export class AppModule {}
