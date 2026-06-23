import { Component } from '@angular/core';
import { AppHeaderComponent } from './app-header';
import { AppFooterComponent } from './app-footer';

@Component({
  selector: 'app-layout',
  imports: [AppHeaderComponent, AppFooterComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {}
