import { Injectable } from "@angular/core";
import { SignalingService } from "./signaling.service";

@Injectable({
  providedIn: "root"
})
export class ShareFileService {
  constructor(private signaling: SignalingService) {}
}
