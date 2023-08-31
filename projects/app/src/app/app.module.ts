import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule, CoreRoutingModule, MapControlsService } from "@tailormap-viewer/core";
import { SharedModule } from "@tailormap-viewer/shared";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LogoOnMapComponent } from './logo-on-map/logo-on-map.component';

@NgModule({
  declarations: [
    AppComponent,
    LogoOnMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    CoreRoutingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(
    mapControlsService: MapControlsService,
  ) {
    mapControlsService.registerComponent(LogoOnMapComponent);
  }
}
