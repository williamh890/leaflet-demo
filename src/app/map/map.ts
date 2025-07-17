import { Component, OnInit, AfterViewInit, output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class Map implements OnInit, AfterViewInit {
  private map!: L.Map

  private drawLayer!: L.FeatureGroup;
  private drawControl!: L.Control;
  private editControl!: L.Control;

  newWkt = output<string>();

  private markers: L.Marker[] = [
    L.marker([64.4156, -150.9315]) // Alaska
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
    this.centerMap();
  }

  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');

    L.tileLayer(baseMapURl, {
      minZoom: 5,
      maxZoom: 15
    }).addTo(this.map);

    L.tileLayer('https://tiles.arcgis.com/tiles/2j08Y1PuezhQEfCz/arcgis/rest/services/ABoVE_2024_WIldfire_Exposure_v2/MapServer/tile/{z}/{y}/{x}', {
      minZoom: 5,
      maxZoom: 15
    }).addTo(this.map);

    this.drawLayer = new L.FeatureGroup();
    this.map.addLayer(this.drawLayer);

    const drawOptions = {
      position: 'topleft',
      draw: {
        polyline: false,
        marker: false,
        circlemarker: false,
        circle: false,
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: 'red'
          }
        },
        rectangle: {
          showArea: false,
          shapeOptions: {
            color: 'red'
          }
        }
      }
    };

    this.drawControl =  new L.Control.Draw(<any>drawOptions);
    this.map.addControl(this.drawControl);

    this.editControl = new L.Control.Draw(<any>{
      edit: {
        featureGroup: this.drawLayer,
        edit: false
      },
      draw: false
    });

    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      const layer = e.layer;

      this.drawLayer.addLayer(layer);
      this.drawControl.remove();
      this.editControl.addTo(this.map);
      this.newWkt.emit(this.wktFromShape(layer));
    });

    this.map.on('draw:deleted', _ => {
        this.editControl.remove();
        this.drawControl.addTo(this.map);
    });
  }

  private wktFromShape(layer: L.Layer): string {
    const geojson = (<any>layer).toGeoJSON();

    const wktStr = 'POLYGON('+
      geojson.geometry.coordinates.map((ring: any) => {
        return '(' + ring.map((p: any) => {
          return p[0] + ' ' + p[1];
          }).join(', ') + ')';
        }).join(', ')+')';

    return wktStr;
  }

  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));

    // Fit the map into the boundary
    this.map.fitBounds(bounds);
    this.map.setZoom(5)
  }
}
