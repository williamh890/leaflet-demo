import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class Map implements OnInit, AfterViewInit {
  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([64.4156, -150.9315]) // Dhaka, Bangladesh
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
  }


  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));

    // Fit the map into the boundary
    this.map.fitBounds(bounds);
    this.map.setZoom(5)
  }
}
