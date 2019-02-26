import {
  Component,
  VERSION,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { ZXingScannerComponent } from "@zxing/ngx-scanner";

@Component({
  selector: "app-sdp-read-qr",
  templateUrl: "./sdp-read-qr.component.html",
  styleUrls: ["./sdp-read-qr.component.css"]
})
export class SdpReadQrComponent implements OnInit {
  @Output() onRead = new EventEmitter<string>();
  ngVersion = VERSION.full;

  @ViewChild("scanner")
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  ngOnInit(): void {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log("Devices: ", devices);
      this.availableDevices = devices;
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error(
        "An error has occurred when trying to enumerate your video-stream-enabled devices."
      );
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  handleQrCodeResult(resultString: string) {
    console.log("Result: ", resultString);
    this.qrResultString = resultString;
    this.onRead.emit(resultString);
    this.selectedDevice = undefined;
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log("Selection changed: ", selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }
}
