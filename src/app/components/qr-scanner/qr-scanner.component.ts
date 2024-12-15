import { Component , AfterViewInit, Input, OnInit, ViewChild , OnDestroy} from '@angular/core';
import { ScannerQRCodeConfig, NgxScannerQrcodeService, ScannerQRCodeSelectedFiles, ScannerQRCodeResult, NgxScannerQrcodeComponent, ScannerQRCodeSymbolType } from 'ngx-scanner-qrcode';
import { AnswerService } from '../../service/answer.service'
import { OfferService } from '../../service/offer.service';
import { WebrtcService } from '../../service/webrtc.service';
@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent implements OnInit, AfterViewInit, OnDestroy{
  @Input() scanType = 'offer'
  qrResult: string | null = null;

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    }
  }
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];
  public qrCodeResult2: ScannerQRCodeSelectedFiles[] = [];
  public percentage = 80;
  public quality = 100;

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  constructor(
     private qrcode: NgxScannerQrcodeService
    ,private answerService:AnswerService
    ,private offerService:OfferService
    ,private webrtcService:WebrtcService
  ){}
  ngOnDestroy(): void {
    this.handle(this.action,'stop');
  }
  ngOnInit(): void {
    if(this.scanType=='offer'){
      this.answerService.showScanner$.subscribe(()=>{
        this.handle(this.action,'start')
      })
      this.answerService.closeScanner$.subscribe(()=>{
        this.handle(this.action,'stop')
      })
    }else{
      this.offerService.showScanner$.subscribe(()=>{
        this.handle(this.action,'start')
      })
      this.offerService.closeScanner$.subscribe(()=>{
        this.handle(this.action,'stop')
      })
    }
  }
  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
    });
  }

   public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    //  alert(e[0].value)
    // console.log(e[0].value) ///resulu of soluton
     e && action && this.handle(this.action,'stop');
     if(this.scanType=='offer'){
      console.log("getting offer")
      this.webrtcService.getOfferSdp$.next(JSON.parse(e[0].value))
      this.answerService.closeScanner()
     }else{
      this.webrtcService.getAnswerSdp$.next(JSON.parse(e[0].value))
      this.offerService.closeOverlay()
     }

  }

  public handle(action: any, fn: string): void {
    // Fix issue #27, #29
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => {
        
      });
    } else {
      this.action.isTorch = false
      action[fn]().subscribe((r: any) =>{

      });
    }
  }
}
