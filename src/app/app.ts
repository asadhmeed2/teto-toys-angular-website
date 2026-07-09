import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './shared';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('teto-toys');
}
