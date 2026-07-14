import { Component } from '@angular/core';
import { AppHeaderComponent } from './app-header';
import { AppFooterComponent } from './app-footer';
import { ToastComponent } from '../toast';

@Component({
  selector: 'app-layout',
  imports: [AppHeaderComponent, AppFooterComponent, ToastComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
})
export class AppLayoutComponent {}
