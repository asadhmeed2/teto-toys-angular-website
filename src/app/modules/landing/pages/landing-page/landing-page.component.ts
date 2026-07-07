import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LandingApiService, Product } from './services/landing-api.service';

@Component({
  selector: 'app-landing-page',
  imports: [CurrencyPipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  private readonly landingApiService = inject(LandingApiService);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadProducts();
  }

  // ponytail: standard fetch implementation using async/await and storing result in signals
  async loadProducts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.landingApiService.getProducts(1, 12);
      this.products.set(response.items || []);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to load products.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
