import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizInGameComponent } from './quiz-in-game.component';

describe('QuizInGameComponent', () => {
  let component: QuizInGameComponent;
  let fixture: ComponentFixture<QuizInGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizInGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizInGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
