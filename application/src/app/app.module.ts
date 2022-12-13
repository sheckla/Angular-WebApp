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


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserLoginComponent,
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
