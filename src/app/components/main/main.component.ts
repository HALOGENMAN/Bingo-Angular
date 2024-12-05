import { Component ,OnInit} from '@angular/core';
import { ConfigService } from '../../service/config.service';

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
  turnStatus:boolean = true
  stopwatchInterval:any;
  life = [1,2,3,4,5]
  lifeLeft = 3
  constructor(public configService:ConfigService ){
    this.configs = configService.getConfig()
    this.lables = this.configs.lables;
  }
  ngOnInit(): void {
    this.startTimer()
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


}
