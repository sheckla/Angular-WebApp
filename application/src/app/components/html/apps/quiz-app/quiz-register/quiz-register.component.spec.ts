import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizRegisterComponent } from './quiz-register.component';

describe('QuizRegisterComponent', () => {
  let component: QuizRegisterComponent;
  let fixture: ComponentFixture<QuizRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizRegisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
