import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  templateUrl: './page-hero.component.html',
  styleUrl: './page-hero.component.scss',
})
export class PageHeroComponent {
  // ponytail: string inputs act as fallback when no template content is projected into the named slots
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
}
