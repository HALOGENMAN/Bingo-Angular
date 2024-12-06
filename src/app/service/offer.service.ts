import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OfferService {
  openOverlay$:Subject<string> = new Subject<string>();
  constructor() { }
  open(){
    this.openOverlay$.next('open')
  }
}
