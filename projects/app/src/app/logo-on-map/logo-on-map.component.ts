import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MapService } from "@tailormap-viewer/map";
import { HttpClient } from "@angular/common/http";
import { Observable, map, of, switchMap, concatMap } from "rxjs";
import { default as WKT } from "ol/format/WKT";
import { Geometry, Point } from "ol/geom";
import { Feature } from "ol";

type LocationServerResponseType = { response: { docs: Array<{ centroide_ll: string }> }};

@Component({
  selector: 'app-logo-on-map',
  templateUrl: './logo-on-map.component.html',
  styleUrls: ['./logo-on-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoOnMapComponent implements OnInit {

  public imgStyle$: Observable<{ top?: string; left?: string; display: string }> = of({ display: 'none' });

  constructor(
    private mapService: MapService,
    private httpClient: HttpClient,
  ) { }

  public ngOnInit(): void {
    // Lookup the address for B3Partners HQ using the 'PDOK locatieserver'
    const url = 'https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?q=Zonnebaan%2012C,%203542%20EC%20Utrecht&rows=1&fl=id,bron,weergavenaam,type,centroide_rd,centroide_ll&fq=*';
    this.imgStyle$ = this.httpClient.get<LocationServerResponseType>(url)
      .pipe(
        switchMap(result => {
          if (!result.response?.docs || result.response.docs.length === 0) {
            return of(null);
          }
          // Get the current projection we are working in
          return this.mapService.getProjectionCode$()
            .pipe(
              concatMap(projectionCode => {
                if (!projectionCode) {
                  return of(null);
                }
                // Convert the WKT from the service to geometry using Openlayers
                const format = new WKT();
                const feature: Feature<Geometry> = format.readFeature(result.response.docs[0].centroide_ll, {
                  dataProjection: 'EPSG:4326',
                  featureProjection: projectionCode
                });
                // Use as Point geometry since we know it's a point
                const coords = (feature.getGeometry() as Point)?.getCoordinates();
                if (!coords) {
                  return of(null);
                }
                // Get screen pixels for coordinates
                return this.mapService.getPixelForCoordinates$([coords[0], coords[1]]);
              })
            )
        }),
        map(coords => {
          if (!coords) {
            // Oops, no coordinates, hide image
            return { display: 'none' };
          }
          // CSS styling to display the image on the correct position
          return { display: 'inline-block', left: `${coords[0]}px`, top: `${coords[1]}px` };
        })
      );
  }

}
