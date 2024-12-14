import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  configs:any
  peerConnection: RTCPeerConnection | null = null;
  offetSdp:any = null
  configuration: RTCConfiguration;
  typeOfSdp:string="";
  setOfferSdp$:Subject<string>  = new Subject<string>()
  setAnswerSdp$:Subject<string> = new Subject<string>()
  getOfferSdp$:Subject<string> = new Subject<string>()
  getAnswerSdp$:Subject<string> = new Subject<string>()
  connectionStatus$:Subject<string> = new Subject<string>()
  getMessage$:Subject<string> = new Subject<string>()

  constructor(
    private configService:ConfigService
  ) { 
    this.configs = this.configService.getConfig();
    this.configuration =  this.configs.webRtcConfig;
  }

  initializeConnection(): void {
    console.log("initilizing connection")
    this.peerConnection = new RTCPeerConnection(this.configuration)
    this.peerConnection.onicecandidate = (e) =>{
      if(this.typeOfSdp == 'offer'){
        this.setOfferSdp$?.next(JSON.stringify(this.peerConnection?.localDescription))
      }
      if(this.typeOfSdp == 'answer'){
        this.setAnswerSdp$?.next(JSON.stringify(this.peerConnection?.localDescription))
      }
    }
    this.getOfferSdp$.subscribe({
      next: (offer)=>{
        this.setOfferAsRemoteDescription(offer)
      }
    })
    this.getAnswerSdp$.subscribe({
      next:(answer)=>{
        this.setAnswerAsRemoteDescription(answer)
      }
    })
  }

  setOfferAsRemoteDescription(offer:any){
    this.peerConnection?.setRemoteDescription(offer).then(a=>{
      this.typeOfSdp = 'answer'
      this.peerConnection?.addEventListener("datachannel", (event) => {
        this.dataChannelInit(event.channel)
      });
      this.peerConnection?.createAnswer().then(answer =>{
        this.peerConnection?.setLocalDescription(answer)
      })
    })
  }

  setAnswerAsRemoteDescription(answer:any){
    this.peerConnection?.setRemoteDescription(answer)
  }

  createOffer():void{
    this.typeOfSdp = 'offer'
    this.dataChannelInit(this.peerConnection?.createDataChannel("sendChannel") as RTCDataChannel)
    this.peerConnection?.createOffer().then((offer)=>{
      this.peerConnection?.setLocalDescription(offer)
    })
  }
  
  dataChannelInit(dataChannel:RTCDataChannel){
    // dataChannel.onmessage = (e:any) =>  {
    //   this.getMessage$.next(e.data)
    // }
    dataChannel.onopen = (e:any) =>{ 
      console.log("opennn")
      this.connectionStatus$.next("open")

    }
    // dataChannel.onclose =(e:any) => this.connectionStatus$.next("close")
    
    // dataChannel.onopen = (e:any) => console.log("open!!!")
    // dataChannel.onclose =(e:any) => this.connectionStatus$.next("close")
  }

}
