import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppMascotComponent } from '../../app-mascot';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppMascotComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {}

