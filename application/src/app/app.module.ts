import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { IndexComponent } from './components/indexPage/index/index.component';
import { DrawAppLayoutComponent } from './components/drawAppPage/draw-app-layout/draw-app-layout.component';
import { DrawAppCanvasComponent } from './components/drawAppPage/draw-app-canvas/draw-app-canvas.component';
import { DrawAppToolsComponent } from './components/drawAppPage/draw-app-tools/draw-app-tools.component';
import { UserLoginComponent } from './components/drawAppPage/user-login/user-login.component';
import { DrawAppDashboardComponent } from './components/drawAppPage/draw-app-dashboard/draw-app-dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { QuizAppLayoutComponent } from './components/quizPage/quiz-app-layout/quiz-app-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    DrawAppCanvasComponent,
    NavbarComponent,
    UserLoginComponent,
    DrawAppToolsComponent,
    DrawAppDashboardComponent,
    DrawAppLayoutComponent,
    IndexComponent,
    QuizAppLayoutComponent,
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
