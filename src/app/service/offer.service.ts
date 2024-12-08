import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OfferService {
  openOverlay$:Subject<string> = new Subject<string>();
  showScanner$:Subject<string> = new Subject<string>();
  closeScanner$:Subject<string> = new Subject<string>();
  closeOverlay$:Subject<string> = new Subject<string>();
  constructor() { }
  open(){
    this.openOverlay$.next('open')
  }
  showScanner(){
    this.showScanner$.next('show')
  }
  closeScanner(){
    this.closeScanner$.next('cose')
  }
  closeOverlay(){
    this.closeOverlay$.next('close')
  }
  
}
