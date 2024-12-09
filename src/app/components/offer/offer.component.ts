import { Component , OnInit} from '@angular/core';
import { OfferService } from '../../service/offer.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.css',
  providers:[MessageService]
})
export class OfferComponent implements OnInit{
  shoeScanner = false;
  overlayOpen = false;
  lables:any;
  configs:any;
  showCopyButton:boolean = true;
  copyButtonClicked = false;
  qrData = "In Angular, a Subject is part of RxJS and acts as both an Observable and an Observer. It's often used for communication between components or services and enables event-driven programming."

  constructor(
     public configService:ConfigService
    ,public offerService:OfferService
    ,private messageService: MessageService
  ){
    this.configs = this.configService.getConfig()
    this.lables = this.configs.lables.offer;
  }
  ngOnInit(): void {
    this.offerService.openOverlay$.subscribe({
      next:()=>{
        this.openOverlay()
        if(this.shoeScanner){
          this.offerService.showScanner()
        }

      }
    })
    this.offerService.closeOverlay$.subscribe({
      next:()=>{
        this.closeOverlay()
      }
    })
  }
  closeOverlay(){
    this.overlayOpen = false
    this.offerService.closeScanner()
  }

  openOverlay(){
    this.overlayOpen = true
    this.offerService.closeScanner()
  }

  copyData(){
    navigator.clipboard.writeText(this.qrData)
    this.copyButtonClicked = true;
    setTimeout(() => {
      this.copyButtonClicked = false;
      this.toast('info','Info','Text Copied')
    }, 10); 
  }
  toast(severity:string,summary:string,detail:string){
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
  enterData(data:any){
    console.log(data.value)
  }
  toggleView(){
    this.shoeScanner = !this.shoeScanner;
    if(this.shoeScanner){
      setTimeout(()=>{
        this.offerService.showScanner()
      },10)
    }else{
      this.offerService.closeScanner()
    }
  }
}
