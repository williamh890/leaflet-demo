import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './map/map';
import { Header } from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Map, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly wkt = signal<string | undefined>(undefined);

  public onNewWkt(newWkt: string) {
    this.wkt.set(newWkt);
  }
}
