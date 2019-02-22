import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SelectFileComponent } from "./components/select-file/select-file.component";
import { DownloadComponent } from "./components/download/download.component";

@NgModule({
  declarations: [AppComponent, SelectFileComponent, DownloadComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
