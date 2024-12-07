import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  openOverlay$:Subject<string> = new Subject<string>();
  constructor() { }
  open(){
    this.openOverlay$.next('open')
  }
}