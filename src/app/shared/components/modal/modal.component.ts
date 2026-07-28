import { Component, HostListener, input, output } from '@angular/core';

/**
 * Generic dialog shell. Body content is projected, so this stays reusable:
 *
 *   <app-modal [open]="isOpen()" title="Opening Hours" (closed)="isOpen.set(false)">
 *     ...content...
 *   </app-modal>
 *
 * Closes on backdrop click, the X button, or Escape.
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  /** Accessible label for the X button — pass a translated string. */
  readonly closeLabel = input('Close');
  /** Caps the dialog width, e.g. '440px'. Bound as a style to avoid
   *  static-class / [class]-binding merge ambiguity. */
  readonly maxWidth = input('420px');

  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.closed.emit();
    }
  }

  protected onClose(): void {
    this.closed.emit();
  }
}
