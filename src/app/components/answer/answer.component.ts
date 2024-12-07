import { Component } from '@angular/core';
import { AnswerService } from '../../service/answer.service';
import { ConfigService } from '../../service/config.service';


@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrl: './answer.component.css'
})
export class AnswerComponent {
  overlayOpen = true;
  lables:any;
  configs:any;

  constructor(
    public configService:ConfigService,
    public answerService:AnswerService,
  ){
    this.configs = this.configService.getConfig()
    this.lables = this.configs.lables.answer;
    this.answerService.openOverlay$.subscribe({
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
