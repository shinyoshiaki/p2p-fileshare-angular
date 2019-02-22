import { Component, OnInit } from "@angular/core";
import {
  getSliceArrayBuffer,
  getChunksHash,
  FileManager
} from "../../../lib/file";
import { SignalingService } from "../../services/signaling.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-select-file",
  templateUrl: "./select-file.component.html",
  styleUrls: ["./select-file.component.css"]
})
export class SelectFileComponent implements OnInit {
  chunks: ArrayBuffer[];
  roomId: string;
  opening = false;
  subscribe: Subscription;

  constructor(private signaling: SignalingService) {}

  ngOnInit() {}

  async openFile(event: any) {
    const blob = event.target.files[0];
    this.opening = true;
    const arr = await getSliceArrayBuffer(blob).catch(console.log);
    this.opening = false;
    if (!arr) return;
    const hash = getChunksHash(arr);
    console.log({ arr, hash });
    this.chunks = arr;
    if (this.subscribe) this.subscribe.unsubscribe();
    this.subscribe = this.signaling.createRoom(hash).subscribe(peer => {
      const file = new FileManager(peer, "file-test");
      file.send(this.chunks, blob.name);
    });
    this.roomId = hash;
  }
}
