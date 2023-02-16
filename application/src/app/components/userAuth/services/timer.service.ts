import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  public timerFinishedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public timerTickEvent: EventEmitter<number> = new EventEmitter<number>();
  public maxTimer: number = 30;
  public currentTimer: number = 0;
  private _timerDelta = 1000;
  private _intervalID: any;

  constructor() { }

  startTimer(maxTimer: number) {
    this.maxTimer = maxTimer;
    clearInterval(this._intervalID);
    this.currentTimer = this.maxTimer;
    console.log("hi");
    this._intervalID = setInterval(() => {
      this.currentTimer--;
      this.timerTickEvent.emit(this.currentTimer);
      if (this.currentTimer === 0) {
        clearInterval(this._intervalID);
        this.timerFinishedEvent.emit(true);
      }
    }, this._timerDelta)
  }

  stopTimer() {
    clearInterval(this._intervalID);
  }

  resetTimer() {
    this.stopTimer();
    this.startTimer(this.maxTimer);
  }
}
