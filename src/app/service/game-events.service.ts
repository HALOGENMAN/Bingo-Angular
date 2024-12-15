import { Injectable } from '@angular/core';
import { ConfigService } from '../service/config.service';


@Injectable({
  providedIn: 'root'
})
export class GameEventsService {
  gameEvents:any;
  config:any;
  constructor(
    private configService:ConfigService
  ) { 
    this.config = this.configService.getConfig();
    this.gameEvents = this.config.gameEvents
  }
  isBoedClickedEvent(payload:any){
    return payload.event === this.gameEvents.boedClicked
  }
  startGameEvent(payload:any){
    return payload.event === this.gameEvents.startGame
  }
  didntStrtGameEvent(payload:any){
    return payload.event === this.gameEvents.didntStartGame
  }
}
