import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawAppToolsComponent} from './draw-app-tools.component';

describe('ZeichentoolsComponent', () => {
  let component: DrawAppToolsComponent;
  let fixture: ComponentFixture<DrawAppToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawAppToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawAppToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
