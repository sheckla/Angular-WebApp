import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/html/index/index.component';
import { QuizAppLayoutComponent } from './components/html/apps/quiz-app/quiz-app-layout/quiz-app-layout.component';
import { QuizRegisterComponent } from './components/html/apps/quiz-app/quiz-register/quiz-register.component';
import { ImpressumComponent } from './components/html/impressum/impressum.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'quizApp', component: QuizAppLayoutComponent},
  { path: 'register', component: QuizRegisterComponent},
  { path: 'impressum', component: ImpressumComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
