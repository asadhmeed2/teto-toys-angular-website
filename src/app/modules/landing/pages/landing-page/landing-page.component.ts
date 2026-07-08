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
  protected readonly categoryMap = signal<Record<number, string>>({});
  protected readonly isLoading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      // ponytail: load categories list and products in parallel to optimize initial load
      await Promise.all([
        this.loadCategories(),
        this.loadProducts()
      ]);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to initialize storefront data.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // ponytail: standard fetch implementation using async/await and storing result in signals
  async loadProducts(): Promise<void> {
    const response = await this.landingApiService.getProducts(1, 12);
    this.products.set(response.items || []);
  }

  // ponytail: load categories into a records dictionary lookup map
  async loadCategories(): Promise<void> {
    const list = await this.landingApiService.getCategories();
    const map: Record<number, string> = {};
    for (const cat of list) {
      map[cat.id] = cat.name;
    }
    this.categoryMap.set(map);
  }
}
