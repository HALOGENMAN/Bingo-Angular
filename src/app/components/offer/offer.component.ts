import { Component } from '@angular/core';
import { OfferService } from '../../service/offer.service';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css'
})
export class OfferComponent {
  overlayOpen = false;
  lables:any;
  configs:any;
  qrData = "In Angular, a Subject is part of RxJS and acts as both an Observable and an Observer. It's often used for communication between components or services and enables event-driven programming."

  constructor(
    public configService:ConfigService,
    public offerService:OfferService,
  ){
    this.configs = this.configService.getConfig()
    this.lables = this.configs.lables.offer;
    this.offerService.openOverlay$.subscribe({
      next:()=>{
        this.openOverlay()
      }
    })
  }
  closeOverlay(){
    this.overlayOpen = false
  }

  openOverlay(){
    this.overlayOpen = true
  }
}
