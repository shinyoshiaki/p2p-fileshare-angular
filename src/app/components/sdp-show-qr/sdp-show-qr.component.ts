import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-sdp-show-qr",
  templateUrl: "./sdp-show-qr.component.html",
  styleUrls: ["./sdp-show-qr.component.css"]
})
export class SdpShowQrComponent implements OnInit {
  @Input() text: string;
  
  constructor() {}

  ngOnInit() {}
}
