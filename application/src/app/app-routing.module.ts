import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawAppLayoutComponent } from './components/drawAppPage/draw-app-layout/draw-app-layout.component';
import { IndexComponent } from './components/indexPage/index/index.component';
import { QuizAppLayoutComponent } from './components/quizPage/quiz-app-layout/quiz-app-layout.component';

const routes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'drawApp', component: DrawAppLayoutComponent },
  { path: 'quizApp', component: QuizAppLayoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
