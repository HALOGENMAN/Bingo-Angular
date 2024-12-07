import { Component ,ElementRef,OnInit, ViewChild} from '@angular/core';
import { ConfigService } from '../../service/config.service';
import { OfferService } from '../../service/offer.service';
import { AnswerService } from '../../service/answer.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit{
  lables:any;
  configs:any;
  connectionStatus:boolean = true;
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

  @ViewChild('songEle') songEle!: ElementRef<HTMLAudioElement>;

  constructor(
    public configService:ConfigService,
    public offerService:OfferService,
    public answerService:AnswerService
  ){
    this.configs = configService.getConfig()
    this.lables = this.configs.lables;
  }
  ngOnInit(): void {
    this.startTimer()
    this.generateBoard()
    this.totalSong = this.configs.songs.length
    this.songSrc = this.configs.songs[this.songNumber-1]
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

  boxClicked(event:Event,item:any){
    event.preventDefault();
    event.stopPropagation()
    if(this.turnStatus) return;
    if(item.clicked) return;
    item.clicked = true
    this.mainAlgorithm()
  }

  startTimer(){
    let counter = 0;
    const maxTime = this.configs.timeInterval  * 100;
    let timerBar:HTMLElement = document.querySelector('.timer-bar') as HTMLElement
    const interval = 1;
    clearInterval(this.stopwatchInterval);
    this.stopwatchInterval = setInterval(() => {
      counter += interval;
      timerBar.style.width = `${counter/maxTime * 100}%`
      if (counter >= maxTime){
        
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
  }
  answer(){
    this.answerService.open() 
  }

}
