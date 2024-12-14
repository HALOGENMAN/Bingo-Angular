import { Component , OnInit} from '@angular/core';
import { OfferService } from '../../service/offer.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from 'primeng/api';
import { WebrtcService } from '../../service/webrtc.service';

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
  qrData = ""

  constructor(
     public configService:ConfigService
    ,public offerService:OfferService
    ,private messageService: MessageService
    ,private webrtcService:WebrtcService
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
    this.webrtcService.connectionStatus$.subscribe({
      next:(data)=>{
        console.log("connection opened",data)
        if(data=='open'){
          this.closeOverlay()
        }
      }
    })
    this.offerService.closeOverlay$.subscribe({
      next:()=>{
        this.closeOverlay()
      }
    })
    this.webrtcService.setOfferSdp$?.subscribe({
      next:(offer)=>{
        this.qrData = offer
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
    this.webrtcService.getAnswerSdp$.next(JSON.parse(data.value))
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
