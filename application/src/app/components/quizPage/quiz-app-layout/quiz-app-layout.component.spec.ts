import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAppLayoutComponent } from './quiz-app-layout.component';

describe('QuizAppLayoutComponent', () => {
  let component: QuizAppLayoutComponent;
  let fixture: ComponentFixture<QuizAppLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizAppLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
