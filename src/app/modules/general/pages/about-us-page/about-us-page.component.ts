import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../../../shared/components/page-hero';

@Component({
  selector: 'app-about-us-page',
  imports: [RouterLink, PageHeroComponent],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss',
})
export class AboutUsPageComponent {}
