import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/html/index/index.component';
import { QuizAppLayoutComponent } from './components/html/apps/quiz-app/quiz-app-layout/quiz-app-layout.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'quizApp', component: QuizAppLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
