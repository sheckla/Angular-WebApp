import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCurrentPlayerComponent } from './quiz-current-player.component';

describe('QuizCurrentPlayerComponent', () => {
  let component: QuizCurrentPlayerComponent;
  let fixture: ComponentFixture<QuizCurrentPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizCurrentPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCurrentPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
