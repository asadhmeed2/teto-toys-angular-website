import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { LandingApiService, Product } from './services/landing-api.service';
import { FavoritesApiService } from '../../../favorites/pages/favorites-page/services/favorites-api.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-landing-page',
  imports: [CurrencyPipe],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  private readonly landingApiService = inject(LandingApiService);
  private readonly favoritesApi = inject(FavoritesApiService);
  protected readonly authService = inject(AuthService);

  protected readonly products = signal<Product[]>([]);
  protected readonly categoryMap = signal<Record<number, string>>({});
  protected readonly categories = signal<{ id: number; name: string; slug: string }[]>([]);
  protected readonly selectedCategory = signal<string>('All');
  protected readonly searchQuery = signal<string>('');
  protected readonly isLoading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);

  // Favorites state
  protected readonly favoriteIds = signal<Set<string>>(new Set());
  protected readonly togglingFavoriteId = signal<string | null>(null);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      // ponytail: load categories list and products in parallel to optimize initial load
      const promises: Promise<any>[] = [this.loadCategories(), this.loadProducts()];
      // Load favorite IDs in parallel only if the user is logged in
      if (this.authService.isAuthenticated()) {
        promises.push(this.loadFavoriteIds());
      }
      await Promise.all(promises);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to initialize storefront data.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // ponytail: standard fetch implementation using async/await and storing result in signals
  async loadProducts(): Promise<void> {
    const response = await this.landingApiService.getProducts(1, 12, this.searchQuery(), this.selectedCategory());
    this.products.set(response.items || []);
  }

  async loadCategories(): Promise<void> {
    const list = await this.landingApiService.getCategories();
    this.categories.set(list || []);
    this.categoryMap.set(Object.fromEntries(list.map(c => [c.id, c.name])));
  }

  // Load just the set of favourite product IDs (lightweight)
  async loadFavoriteIds(): Promise<void> {
    const ids = await this.favoritesApi.getFavoriteIds();
    this.favoriteIds.set(new Set(ids));
  }

  protected isFavorite(productId: string): boolean {
    return this.favoriteIds().has(productId);
  }

  protected async toggleFavorite(event: MouseEvent, productId: string): Promise<void> {
    event.stopPropagation();
    if (!this.authService.isAuthenticated() || this.togglingFavoriteId()) return;
    this.togglingFavoriteId.set(productId);
    try {
      if (this.isFavorite(productId)) {
        await this.favoritesApi.removeFavorite(productId);
        this.favoriteIds.update(set => { const s = new Set(set); s.delete(productId); return s; });
      } else {
        await this.favoritesApi.addFavorite(productId);
        this.favoriteIds.update(set => new Set([...set, productId]));
      }
    } catch {
      // silently ignore — don't interrupt browsing
    } finally {
      this.togglingFavoriteId.set(null);
    }
  }

  async selectCategory(categoryId: string): Promise<void> {
    this.selectedCategory.set(categoryId);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.loadProducts();
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to load products.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSearch(term: string): Promise<void> {
    this.searchQuery.set(term);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.loadProducts();
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to load products.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearchKeyup(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(async () => {
      await this.onSearch(value);
    }, 300);
  }
}
