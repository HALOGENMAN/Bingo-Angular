import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './service/config.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OfferComponent } from './components/offer/offer.component';
import { AnswerComponent } from './components/answer/answer.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component'
import { MainComponent } from './components/main/main.component';
import { CommonModule } from '@angular/common';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QrCodeModule } from 'ng-qrcode';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';

import { TooltipModule } from 'primeng/tooltip';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastModule } from 'primeng/toast';


LOAD_WASM('assets/wasm/ngx-scanner-qrcode.wasm').subscribe();

export function initializeApp(configService: ConfigService): () => Promise<void> {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
     AppComponent
    ,OfferComponent
    ,AnswerComponent
    ,QrScannerComponent
    ,MainComponent
    
  ],
  imports: [
     BrowserModule
    ,AppRoutingModule
    ,BrowserAnimationsModule
    ,CommonModule
    ,NgbModule
    ,TooltipModule
    ,NgbPopoverModule
    ,QrCodeModule
    ,NgxScannerQrcodeModule
    ,ToastModule
  ],
  providers: [
    provideHttpClient(withInterceptors([])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
