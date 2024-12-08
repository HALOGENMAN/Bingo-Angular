import { Component , AfterViewInit, Input, OnInit, ViewChild} from '@angular/core';
import { QrScannerService } from '../../service/qr-scanner.service';
import { ScannerQRCodeConfig, NgxScannerQrcodeService, ScannerQRCodeSelectedFiles, ScannerQRCodeResult, NgxScannerQrcodeComponent, ScannerQRCodeSymbolType } from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent implements OnInit, AfterViewInit{
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
     public qrScannerService:QrScannerService
    ,private qrcode: NgxScannerQrcodeService
  ){}
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
    });
    this.handle(this.action,'start')
  }

   public onEvent(e: ScannerQRCodeResult[], action?: any): void {
     alert(e[0].value)
    e && action && this.handle(this.action,'stop');
  }

  public handle(action: any, fn: string): void {
    // Fix issue #27, #29
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r));
    } else {
      this.action.isTorch = false
      action[fn]().subscribe((r: any) => console.log(fn, r));
    }
  }

  
}
