import sha1 from "sha1";
import { Buffer } from "buffer";
import WebRTC from "webrtc4me";
import { Subject } from "rxjs";

const chunkSize = 16000;
const sleep = parseInt(((256 * 1000) / chunkSize).toString());
console.log(sleep);

export function getSliceArrayBuffer(blob: Blob) {
  console.log("blob blob", blob);
  return new Promise<ArrayBuffer[]>((resolve, reject) => {
    let arr = [];
    const r = new FileReader(),
      blobSlice = File.prototype.slice,
      chunks = Math.ceil(blob.size / chunkSize);
    let currentChunk = 0;
    r.onerror = e => {
      reject(e);
    };
    r.onload = e => {
      arr.push((e.target as any).result);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(arr);
      }
    };
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= blob.size ? blob.size : start + chunkSize;
      r.readAsArrayBuffer(blobSlice.call(blob, start, end));
    }
    loadNext();
  });
}

export function getChunksHash(arr: ArrayBuffer[]) {
  const hashes = arr.map(ab => sha1(Buffer.from(ab)).toString());
  let ans = "";
  hashes.forEach(hash => (ans += hash));
  return sha1(ans).toString();
}

export function blob2DataUrl(blob) {
  return new Promise(resolve => {
    const r = new FileReader();
    r.onload = e => {
      resolve((e.target as any).result);
    };
    console.log("blob2dataurl", { blob });
    r.readAsDataURL(blob);
  });
}

interface Action {
  type: string;
  payload: any;
}

class Downloading implements Action {
  type: "downloading";
  payload: { now: number; size: number };
}

class Downloaded implements Action {
  type: "downloaded";
  payload: { chunks: ArrayBuffer[]; name: string };
}

type Actions = Downloading | Downloaded;

export class FileManager {
  subject = new Subject<Actions>();
  state = this.subject.asObservable();

  private chunks: ArrayBuffer[] = [];
  private name: string;
  private size: number;

  constructor(private peer: WebRTC, private label?: string) {
    if (!label) label = "file";
    console.log({ label });
    peer.addOnData(raw => {
      const { label, data } = raw;
      if (label === this.label) {
        try {
          const obj = JSON.parse(data);
          switch (obj.state) {
            case "start":
              this.chunks = [];
              this.name = obj.name;
              this.size = obj.size;
              break;
            case "end":
              this.subject.next({
                type: "downloaded",
                payload: { chunks: this.chunks, name: this.name }
              } as Downloaded);
              this.chunks = [];
              this.name = "";
              break;
          }
        } catch (error) {
          this.chunks.push(data);
          this.subject.next({
            type: "downloading",
            payload: { now: this.chunks.length, size: this.size }
          } as Downloading);
        }
      }
    }, label);
  }

  async send(chunks: ArrayBuffer[], name: string) {
    this.peer.send(
      JSON.stringify({ state: "start", size: chunks.length, name }),
      this.label
    );

    let i = 0;
    for (let chunk of chunks) {
      this.peer.send(chunk, this.label);
      if (i++ % sleep === 0) await new Promise(r => setTimeout(r, 0));
    }

    this.peer.send(JSON.stringify({ state: "end" }), this.label);
  }
}
