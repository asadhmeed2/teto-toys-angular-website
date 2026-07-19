import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppMascotComponent } from '../../app-mascot';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, AppMascotComponent, TranslatePipe],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {}

