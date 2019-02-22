import { Component, OnInit, NgZone } from "@angular/core";
import { SignalingService } from "../../services/signaling.service";
import { FileManager } from "../../../lib/file";
import { Subscription } from "rxjs";

@Component({
  selector: "app-download",
  templateUrl: "./download.component.html",
  styleUrls: ["./download.component.css"]
})
export class DownloadComponent implements OnInit {
  roomId: string;
  viewRoomId: string;
  subscribes: Subscription[] = [];
  progress: string;
  timer: string;

  constructor(private signaling: SignalingService, private zone: NgZone) {}

  ngOnInit() {}

  joinRoom() {
    this.subscribes.forEach(subscribe => subscribe && subscribe.unsubscribe());
    this.subscribes.push(
      this.signaling.joinRoom(this.roomId).subscribe(peer => {
        const file = new FileManager(peer, "file-test");
        let sec = 0;
        const interval = setInterval(() => {
          this.zone.run(() => {
            sec++;
            this.timer = sec + " sec";
          });
        }, 1000);
        this.subscribes.push(
          file.state.subscribe(action => {
            if (action.type === "downloaded") {
              const { chunks, name } = action.payload;

              const blob = new Blob(chunks);
              const url = window.URL.createObjectURL(blob);
              const anchor = document.createElement("a");
              anchor.download = name;
              anchor.href = url;
              anchor.click();
              clearInterval(interval);
            } else if (action.type === "downloading") {
              const { size, now } = action.payload;
              this.zone.run(() => {
                this.progress =
                  parseInt(((now / size) * 100).toString()) + " %";
              });
            }
          })
        );
      })
    );
    this.viewRoomId = this.roomId;
    this.roomId = "";
  }
}
