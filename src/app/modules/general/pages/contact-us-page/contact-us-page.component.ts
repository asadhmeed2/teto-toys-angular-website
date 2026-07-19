import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactApiService } from './services/contact-api.service';
import { PageHeroComponent } from '../../../../shared/components/page-hero';

@Component({
  selector: 'app-contact-us-page',
  imports: [PageHeroComponent, TranslatePipe],
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
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly contactApi = inject(ContactApiService);

  protected async onSubmit(): Promise<void> {
    if (!this.name() || !this.email() || !this.message() || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    try {
      await this.contactApi.submitContact({
        name: this.name(),
        email: this.email(),
        subject: this.subject() || undefined,
        message: this.message(),
      });
      this.submitted.set(true);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to send your message. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected reset(): void {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
    this.submitted.set(false);
    this.errorMessage.set(null);
  }
}
