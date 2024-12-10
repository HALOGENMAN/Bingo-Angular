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
  constructor(
    private configService:ConfigService
  ) { 
    this.configs = configService.getConfig();
    this.configuration =  this.configs.webRtcConfig;
  }

  initializeConnection(): void {
    if(!this.peerConnection) return;
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection State:', this.peerConnection?.connectionState);
    };

    let sendChannel = this.peerConnection.createDataChannel("sendChannel");
    sendChannel.onopen = e =>{
      console.log("Connection open")
    }
    sendChannel.onclose =e => console.log("closed!!!!!!");

    console.log('PeerConnection initialized');

    this.peerConnection.ondatachannel= e => {
      const receiveChannel = e.channel;
      receiveChannel.onmessage =e =>  console.log("messsage received!!!"  + e.data )
      receiveChannel.onopen = e => console.log("open!!!!");
      receiveChannel.onclose =e => console.log("closed!!!!!!");
      // this.peerConnection?.channel = receiveChannel;

}
  }

  async createOffer(): Promise<string> {
    if(!this.offetSdp)
      return this.offetSdp;

    if (!this.peerConnection) {
      throw new Error('PeerConnection is not initialized.');
    }

    try {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      console.log('Created Offer:', offer.sdp);
      return  this.offetSdp = offer.sdp || '';
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  }

  async connectWithRemote(answerSdp:string){
    if (!this.peerConnection) {
      throw new Error('PeerConnection is not initialized.');
    }
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSdp,
    });
    await this.peerConnection.setRemoteDescription(answer);
  }

  async createAnswer(offerSdp: string): Promise<string> {
    if (!this.peerConnection) {
      throw new Error('PeerConnection is not initialized.');
    }
    try {
      // Set the remote description to the received offer
      const offer = new RTCSessionDescription({
        type: 'offer',
        sdp: offerSdp,
      });
      await this.peerConnection.setRemoteDescription(offer);

      // Create an SDP answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      console.log('Created Answer:', answer.sdp);
      return answer.sdp || '';
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  }

}
