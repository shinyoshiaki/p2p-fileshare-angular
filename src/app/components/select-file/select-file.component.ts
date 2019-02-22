import { Component, OnInit } from "@angular/core";
import { getSliceArrayBuffer, FileManager } from "../../../lib/file";
import { SignalingService } from "../../services/signaling.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-select-file",
  templateUrl: "./select-file.component.html",
  styleUrls: ["./select-file.component.css"]
})
export class SelectFileComponent implements OnInit {
  roomId: string;
  opening = false;
  subscribe: Subscription;

  constructor(private signaling: SignalingService) {}

  ngOnInit() {}

  async openFile(event: any) {
    if (this.subscribe) this.subscribe.unsubscribe();

    const blob: File = event.target.files[0];
    const hash = Math.random().toString();

    this.subscribe = this.signaling.createRoom(hash).subscribe(peer => {
      const file = new FileManager(peer, "file-test");
      file.sendStart(blob.name, blob.size);
      this.opening = true;
      const observer = getSliceArrayBuffer(blob);
      observer.subscribe(
        ab => {
          file.sendChunk(ab);
        },
        () => {},
        () => {
          file.sendEnd();
          this.opening = false;
        }
      );
    });
    this.roomId = hash;
  }
}
