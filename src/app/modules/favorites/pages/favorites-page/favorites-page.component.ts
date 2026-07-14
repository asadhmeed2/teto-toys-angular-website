import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FavoritesApiService } from './services/favorites-api.service';
import { Product } from '../../../landing/pages/landing-page/services/landing-api.service';
import { ToastService } from '../../../../shared/services';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.scss',
})
export class FavoritesPageComponent implements OnInit {
  private readonly favoritesApi = inject(FavoritesApiService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly favorites = signal<Product[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly removingId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadFavorites();
  }

  async loadFavorites(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.favoritesApi.getFavorites();
      this.favorites.set(res.items ?? []);
    } catch (err: any) {
      this.errorMessage.set(err.message || 'Failed to load favorites.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected viewDetails(product: Product): void {
    this.router.navigate(['/product', product.product_id], { state: { product } });
  }

  async removeFromFavorites(product: Product): Promise<void> {
    const productId = product.product_id;
    if (this.removingId()) return;
    this.removingId.set(productId);
    try {
      await this.favoritesApi.removeFavorite(productId);
      this.favorites.update((list) => list.filter((p) => p.product_id !== productId));
    } catch {
      this.toastService.show(`Couldn't remove "${product.title}" from favorites — try again.`);
    } finally {
      this.removingId.set(null);
    }
  }
}
