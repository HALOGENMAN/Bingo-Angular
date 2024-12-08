import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrScannerComponent } from './qr-scanner.component';
import { BarcodeFormat } from '@zxing/library';


describe('QrScannerComponent', () => {
  let component: QrScannerComponent;
  let fixture: ComponentFixture<QrScannerComponent>;

  let allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/ ];
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QrScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
