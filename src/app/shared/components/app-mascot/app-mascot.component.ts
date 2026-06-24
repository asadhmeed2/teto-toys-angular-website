import { Component, input } from '@angular/core';

@Component({
  selector: 'app-mascot',
  templateUrl: './app-mascot.component.html',
  styleUrl: './app-mascot.component.scss',
})
export class AppMascotComponent {
  readonly width = input<string | number>('100%');
  readonly height = input<string | number>('100%');
  readonly passwordFocused = input<boolean>(false);
}
