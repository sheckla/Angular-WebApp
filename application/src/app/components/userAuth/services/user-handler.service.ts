import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//This service will be an interface to the Client, which is written in JavaScript
//We will also implements an observerable ConnectedStatus
export class UserHandlerService {
  private clientName: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public clientName$: Observable<any[]> = this.clientName.asObservable();

  updateClientName(updatedClientName) {
    this.clientName.next(updatedClientName);
  }
  constructor() { }
}


