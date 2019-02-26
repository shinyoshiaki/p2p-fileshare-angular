import { Component, OnInit, NgZone } from "@angular/core";
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

  subscribe: Subscription;
  uploading = false;

  constructor(private signaling: SignalingService, private zone: NgZone) {}

  ngOnInit() {}

  async openFile(event: any) {
    if (this.subscribe) this.subscribe.unsubscribe();

    const blob: File = event.target.files[0];
    const hash = Math.random().toString();

    this.subscribe = this.signaling.createRoom(hash).subscribe(peer => {
      this.zone.run(() => {
        this.uploading = true;
      });

      const file = new FileManager(peer, "file-test");
      file.sendStart(blob.name, blob.size);

      const observer = getSliceArrayBuffer(blob);
      observer.subscribe(
        ab => {
          file.sendChunk(ab);
        },
        () => {
          console.log("error");
        },
        () => {
          file.sendEnd();
        }
      );
      peer.addOnData(msg => {
        try {
          if (msg.label === file.label) {
            const obj = JSON.parse(msg.data);
            console.log({ obj, file });
            const { state, name } = obj;
            if (state === "complete" && name === file.name) {
              console.log("complete");
              this.zone.run(() => {
                this.uploading = false;
              });
            }
          }
        } catch (error) {}
      });
    });
    this.roomId = hash;
  }
}
