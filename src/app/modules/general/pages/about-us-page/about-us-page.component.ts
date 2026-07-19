import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { PageHeroComponent } from '../../../../shared/components/page-hero';

@Component({
  selector: 'app-about-us-page',
  imports: [RouterLink, PageHeroComponent, TranslatePipe],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss',
})
export class AboutUsPageComponent {}
