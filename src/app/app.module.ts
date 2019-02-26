import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgxKjuaModule } from "ngx-kjua";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SelectFileComponent } from "./components/select-file/select-file.component";
import { DownloadComponent } from "./components/download/download.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { SdpShowQrComponent } from "./components/sdp-show-qr/sdp-show-qr.component";
import { SdpReadQrComponent } from "./components/sdp-read-qr/sdp-read-qr.component";
import { ZXingScannerModule } from "@zxing/ngx-scanner";

@NgModule({
  declarations: [
    AppComponent,
    SelectFileComponent,
    DownloadComponent,
    SdpShowQrComponent,
    SdpReadQrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    }),
    NgxKjuaModule,
    ZXingScannerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
