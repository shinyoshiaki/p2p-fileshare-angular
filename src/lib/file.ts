const sha1 = require("sha1");
import { Buffer } from "buffer";
import WebRTC from "webrtc4me";

export function getSliceArrayBuffer(blob: Blob) {
  console.log("blob blob", blob);
  return new Promise<ArrayBuffer[]>((resolve, reject) => {
    let arr = [];
    const r = new FileReader(),
      blobSlice = File.prototype.slice,
      chunkSize = 16384,
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

export class FileManager {
  onFile: (chunks: ArrayBuffer[], name: string) => void;
  private chunks: ArrayBuffer[] = [];
  private name: string;

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
              break;
            case "end":
              this.onFile(this.chunks, this.name);
              this.chunks = [];
              this.name = "";
              break;
          }
        } catch (error) {
          this.chunks.push(data);
        }
      }
    }, label);
  }

  async send(chunks: ArrayBuffer[], name: string) {
    this.peer.send(
      JSON.stringify({ state: "start", length: chunks.length, name }),
      this.label
    );

    for (let chunk of chunks) {
      this.peer.send(chunk, this.label);
      await new Promise(r => setTimeout(r, 1));
    }

    this.peer.send(
      JSON.stringify({ state: "end", length: chunks.length }),
      this.label
    );
  }
}
