import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-us-page',
  imports: [RouterLink],
  templateUrl: './contact-us-page.component.html',
  styleUrl: './contact-us-page.component.scss',
})
export class ContactUsPageComponent {
  // ponytail: simple signal-based form state — no reactive forms needed for a static contact page
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly subject = signal('');
  protected readonly message = signal('');
  protected readonly submitted = signal(false);

  protected onSubmit(): void {
    // ponytail: placeholder submit handler — wire to a real API endpoint when backend is ready
    if (this.name() && this.email() && this.message()) {
      this.submitted.set(true);
    }
  }

  protected reset(): void {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.submitted.set(false);
  }
}
