import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppMascotComponent } from '../../app-mascot';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppMascotComponent],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {}

