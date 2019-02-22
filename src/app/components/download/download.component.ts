import { Component, OnInit, NgZone } from "@angular/core";
import { SignalingService } from "../../services/signaling.service";
import { FileManager, getChunksHash, blob2DataUrl } from "../../../lib/file";
import { Subscription } from "rxjs";

@Component({
  selector: "app-download",
  templateUrl: "./download.component.html",
  styleUrls: ["./download.component.css"]
})
export class DownloadComponent implements OnInit {
  roomId: string;
  viewRoomId: string;
  subscribe: Subscription;

  constructor(private signaling: SignalingService) {}

  ngOnInit() {}

  joinRoom() {
    if (this.subscribe) this.subscribe.unsubscribe();
    this.subscribe = this.signaling.joinRoom(this.roomId).subscribe(peer => {
      const file = new FileManager(peer, "file-test");
      file.onFile = async (chunks, name) => {
        const hash = getChunksHash(chunks);
        console.log({ chunks, hash });
        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = name;
        anchor.href = url;
        anchor.click();
      };
    });
    this.viewRoomId = this.roomId;
    this.roomId = "";
  }
}
