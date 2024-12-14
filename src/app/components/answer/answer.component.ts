import { Component , OnInit, AfterViewInit} from '@angular/core';
import { AnswerService } from '../../service/answer.service';
import { ConfigService } from '../../service/config.service';
import { MessageService } from 'primeng/api'
import { WebrtcService } from '../../service/webrtc.service';



@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css',
  providers:[MessageService]
})
export class AnswerComponent implements OnInit,AfterViewInit{
  shoeScanner = true;
  overlayOpen = false;
  lables:any;
  configs:any;
  showCopyButton:boolean = true;
  copyButtonClicked = false;
  qrData = ""
  constructor(
     public configService:ConfigService
    ,public answerService:AnswerService
    ,private messageService: MessageService
    ,private webrtcService:WebrtcService
  ){
    this.configs = this.configService.getConfig()
    this.lables = this.configs.lables.answer;
  }
  ngAfterViewInit(): void {
    // if(this.shoeScanner){
    //   this.answerService.showScanner()
    // }
  }

  ngOnInit(): void {
    this.answerService.openOverlay$.subscribe({
      next:()=>{
        this.openOverlay()
      }
    })

    this.answerService.closeOverlay$.subscribe({
      next:()=>{
        this.closeOverlay()
      }
    })

    // this.webrtcService.connectionStatus$.subscribe({
    //   next:(data)=>{
    //     if(data=='open'){
    //       setTimeout(()=>{
    //         this.closeOverlay()
    //       },100)
    //     }
    //   }
    // })

    this.answerService.closeScanner$.subscribe(()=>{
      this.shoeScanner = false
    })

    this.webrtcService.setAnswerSdp$.subscribe({
      next:(answer)=>{
        this.qrData = answer
      }
    })
  }

  closeOverlay(){
    this.overlayOpen = false
    this.answerService.closeScanner()
  }

  openOverlay(){
    this.overlayOpen = true
    this.shoeScanner = true
    setTimeout(()=>{
      this.answerService.showScanner()
    },10)
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
    this.shoeScanner = false
    this.webrtcService.getOfferSdp$.next(JSON.parse(data.value))
  }
}
