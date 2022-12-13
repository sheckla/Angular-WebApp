import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAppCanvasComponent } from './draw-app-canvas.component';

describe('ZeichenflaecheComponent', () => {
  let component: DrawAppCanvasComponent;
  let fixture: ComponentFixture<DrawAppCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawAppCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAppCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
