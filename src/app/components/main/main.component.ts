import { Component ,ElementRef,OnInit, ViewChild,ChangeDetectorRef, NgZone} from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { OfferService } from '../../service/offer.service';
import { AnswerService } from '../../service/answer.service';
import { WebrtcService } from '../../service/webrtc.service';
import { MessageService } from 'primeng/api'
import { GameEventsService } from '../../service/game-events.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers:[MessageService]
})
export class MainComponent implements OnInit{
  lables:any;
  configs:any;
  connectionStatus:boolean = false;
  playingStatus:boolean = false
  turnStatus:boolean = false
  stopwatchInterval:any;
  life = [1,2,3,4,5]
  lifeLeft = 3
  songNumber = 1;
  totalSong = 1
  volumeLevel = 0;
  totalVolumeLevel = 4;
  volumeType = ['xmark','off','low','high']
  songSrc = ''
  autoPlay = false
  boardNumber:any[] = [];
  gameEvents:any;

  @ViewChild('songEle') songEle!: ElementRef<HTMLAudioElement>;

  constructor(
     public configService:ConfigService
    ,public offerService:OfferService
    ,public answerService:AnswerService
    ,public webrtcService:WebrtcService
    ,private messageService:MessageService
    ,private cd:ChangeDetectorRef
    ,private gameEventsService:GameEventsService
    ,private ngZone: NgZone
  ){
    this.configs = configService.getConfig()
    this.lables = this.configs.lables;
    this.gameEvents = this.configs.gameEvents
  }
  ngOnInit(): void {
    this.webrtcService.initializeConnection()
    this.generateBoard()
    this.totalSong = this.configs.songs.length
    this.songSrc = this.configs.songs[this.songNumber-1]
    this.webrtcService.connectionStatus$.subscribe({
      next:(data)=>{
        if(data=='open'){
          this.connectionStatus = true
          this.toast('success','Connected','Connected with other player')
        }
        if(data=='close'){
          this.connectionStatus = false
        }
      }
    })
    this.webrtcService.getMessage$.subscribe({
      next:payload=>{
        console.log("payload at:",payload)
        this.recivedMessage(payload)
      }
    })
  }



  generateBoard(){
    this.boardNumber = [];
    const array = Array.from({ length: 25 }, (_, i) => i + 1);
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]]; // Swap
    }

    for(let i=0;i<25;i++){
      this.boardNumber.push({
        number:array[i],
        matched:false,
        clicked:false
      })
    }

  }

  

  startTimer(fn:any){
    let counter = 0;
    const maxTime = this.configs.timeInterval  * 100;
    let timerBar:HTMLElement = document.querySelector('.timer-bar') as HTMLElement
    const interval = 1;
    clearInterval(this.stopwatchInterval)
    this.stopwatchInterval = setInterval(() => {
      counter += interval;
      timerBar.style.width = `${counter/maxTime * 100}%`
      if (counter >= maxTime){
        fn()
        timerBar.style.width = `${0}%`
        clearInterval(this.stopwatchInterval);
      }
    }, interval);
  }

  calculateNodeIndex(r:number,c:number):number{
    return (r*5)+c;
  }
  mainAlgorithm(){
    // if(!areYouInTheGame) return;
    let count=0;
    // top left diagonal
    let check = true;
    for(let i=0;i<5;i++){
      if(!this.boardNumber[this.calculateNodeIndex(i,i)].clicked){
        check=false;
        break;
      }
    }
    if(check){
      count++;
      for(let i=0;i<5;i++){
        this.boardNumber[this.calculateNodeIndex(i,i)].matched=true;
      }
    } 
    // top right diagonal
    check = true;
    for(let i=0;i<5;i++){
      if(!this.boardNumber[this.calculateNodeIndex(i,4-i)].clicked){
        check=false;
        break;
      }
    }
    if(check){
      count++;
      for(let i=0;i<5;i++){
        this.boardNumber[this.calculateNodeIndex(i,4-i)].matched=true
      }
    } 
  
    // calculate rows
    for(let r=0;r<5;r++){
      check = true;
      for(let c=0;c<5;c++){
        if(!this.boardNumber[this.calculateNodeIndex(r,c)].clicked){
          check=false;
          break;
        }
      }
      if(check){
        count++;
        for(let c=0;c<5;c++){
          this.boardNumber[this.calculateNodeIndex(r,c)].matched=true
        }
      } 
      if(count>=5){
        console.log("you won the game")
        // areYouInTheGame = false
        return;
      }
    }
  
    // calculate columns
    for(let c=0;c<5;c++){
      check = true;
      for(let r=0;r<5;r++){
        if(!this.boardNumber[this.calculateNodeIndex(r,c)].clicked){
          check=false;
          break;
        }
      }
      if(check){
        count++;
        for(let r=0;r<5;r++){
          this.boardNumber[this.calculateNodeIndex(r,c)].matched=true
        }
      } 
      if(count>=5){
        console.log("you won the game")
        // areYouInTheGame = false
        return;
      }
    }
    
  }

  changeSong(){
    this.songNumber = this.songNumber%this.totalSong + 1;
    this.songSrc = this.configs.songs[this.songNumber-1];
  }
  changeMusicVolume(){
    this.volumeLevel  = (this.volumeLevel+1)%this.totalVolumeLevel; 
    console.log(this.volumeLevel)
    if(this.volumeLevel==0){
      this.songEle.nativeElement.pause();
    }else if(this.volumeLevel==1){
      this.autoPlay = true;
      this.songEle.nativeElement.play();
      this.songEle.nativeElement.volume = 0.5;
    }else if(this.volumeLevel==2){
      this.songEle.nativeElement.volume = 0.7;
    }else{
      this.songEle.nativeElement.volume = 1;
    }
  }

  offer(){
    this.offerService.open()
    this.webrtcService.createOffer()
  }

  answer(){
    this.answerService.open() 
  }

  toast(severity:string,summary:string,detail:string){
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }

  
  recivedMessage(payload:any){
    if(this.gameEventsService.isBoedClickedEvent(payload)){
      this.boardClickedByOtherPlayer(payload.message)
    } else if(this.gameEventsService.startGameEvent(payload)){
      this.startGameTurn(payload)
    } else if(this.gameEventsService.gameStartedEvent(payload)){
      this.gameStarted(payload)
    } else if(this.gameEventsService.chanceMissedEvent(payload)){
      this.chanceMissed(payload)
    }
    
    this.cd.detectChanges()
  }

  boxClicked(event:Event,item:any){
    event.preventDefault();
    event.stopPropagation()
    if(!this.turnStatus) return;
    if(item.clicked) return;
    this.turnStatus = false;
    item.clicked = true
    clearTimeout(this.stopwatchInterval)
    this.mainAlgorithm()
    this.webrtcService.sendMessage({
      event:this.gameEvents.boedClicked,
      message:item.number
    })
  }

  boardClickedByOtherPlayer(number:number){
    let index = this.boardNumber.findIndex(e=>{
      return e.number === Number(number)
    })
    this.boardNumber[index].clicked = true
    this.turnStatus = true;
    this.mainAlgorithm()
    this.chanceMissedCall()
    
  }

  startGameTurn(payload:any){
    if(this.playingStatus) return
    this.turnStatus = true
    this.toast('info','Strat Game!!',payload.message)
    this.startTimer(()=>{
      this.ngZone.run(()=>{
        this.turnStatus = false
      })
      
      this.webrtcService.sendMessage({
        event:this.gameEvents.startGame,
        message:this.configs.didntStrtGame
      })
    })
  }
  resetBoard(){
    this.generateBoard()
  }

  startGame(){
    if(!this.connectionStatus){
      this.toast('error','Not Connected','Please connect with other player to start the game..')
      return;
    }
    if(this.playingStatus){
      this.toast('error','In Game','Already In A game Can Not Start Again..')
      return;
    }
    if(!this.turnStatus){
      this.toast('error','Not Your Turn','Please Wait For Your Turn..')
      return;
    }
    this.playingStatus = true
    this.resetBoard();
    
    this.webrtcService.sendMessage({
      event:this.gameEvents.gameStarted,
      message:"Game started please wait for your turn..."
    })

    this.startTimer(()=>{
      
    })

  }
  gameStarted(payload:any){
    this.playingStatus = true;
    this.resetBoard();
    this.toast('info','Game Started',payload.message)
  }

  chanceMissed(payload:any){
    this.turnStatus = true;
    this.toast('info','Chance Missed',payload.message)
    this.chanceMissedCall()
  }

  chanceMissedCall(){
    this.startTimer(()=>{
      this.ngZone.run(()=>{
        this.turnStatus = false;
      })
      this.webrtcService.sendMessage({
        event:this.gameEvents.chanceMissed,
        message:'Other Player missed the chance...'
      })
    })
  }

}
