import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAppLayoutComponent } from './draw-app-layout.component';

describe('DrawAppLayoutComponent', () => {
  let component: DrawAppLayoutComponent;
  let fixture: ComponentFixture<DrawAppLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawAppLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAppLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
