import { render, screen } from '@testing-library/angular';
import { LogoOnMapComponent } from './logo-on-map.component';
import { of } from "rxjs";
import { MapService } from "@tailormap-viewer/map";
import { HttpClient } from "@angular/common/http";

describe('LogoOnMapComponent', () => {

  test('should render', async () => {
    const httpClient = {
      get: jest.fn(() => of({
        response: {
          docs: [
            { centroide_ll: 'POINT(5.04185307 52.11887446)' },
          ],
        },
      })),
    };
    const mapService = {
      getProjectionCode$: jest.fn(() => of('EPSG:28992')),
      getPixelForCoordinates$: jest.fn(() => of([ 5, 5 ])),
    }
    await render(LogoOnMapComponent, {
      providers: [
        { provide: MapService, useValue: mapService },
        { provide: HttpClient, useValue: httpClient },
      ]
    });
    const img = await screen.getByAltText('Logo B3Partners');
    expect((img as HTMLElement).style.left).toEqual('5px');
    expect((img as HTMLElement).style.top).toEqual('5px');
  });

});
