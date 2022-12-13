import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAppDashboardComponent } from './draw-app-dashboard.component';

describe('DrawAppDashboardComponent', () => {
  let component: DrawAppDashboardComponent;
  let fixture: ComponentFixture<DrawAppDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawAppDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAppDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
