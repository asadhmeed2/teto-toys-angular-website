import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LandingApiService, Product } from '../landing-page/services/landing-api.service';
import { FavoritesApiService } from '../../../favorites/pages/favorites-page/services/favorites-api.service';
import { AuthService, ToastService } from '../../../../shared/services';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly landingApiService = inject(LandingApiService);
  private readonly favoritesApi = inject(FavoritesApiService);
  private readonly toastService = inject(ToastService);
  protected readonly authService = inject(AuthService);

  protected readonly product = signal<Product | null>(null);
  protected readonly notFound = signal(false);
  protected readonly categoryMap = signal<Record<number, string>>({});
  protected readonly isFavorite = signal(false);
  protected readonly togglingFavorite = signal(false);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    // ponytail: no backend get-by-id endpoint exists yet, so the product travels via router
    // navigation state from the catalog click; direct/refreshed links fall back to notFound.
    const state = history.state as { product?: Product } | undefined;

    if (state?.product && state.product.product_id === id) {
      this.product.set(state.product);
      if (this.authService.isAuthenticated()) {
        this.loadFavoriteState(state.product.product_id);
      }
    } else {
      this.notFound.set(true);
    }

    this.loadCategories();
  }

  private async loadCategories(): Promise<void> {
    try {
      const list = await this.landingApiService.getCategories();
      this.categoryMap.set(Object.fromEntries(list.map(c => [c.id, c.name])));
    } catch {
      // category names are cosmetic only — a failed lookup shouldn't block the product page
    }
  }

  private async loadFavoriteState(productId: string): Promise<void> {
    try {
      const ids = await this.favoritesApi.getFavoriteIds();
      this.isFavorite.set(ids.includes(productId));
    } catch {
      // non-critical
    }
  }

  protected async toggleFavorite(): Promise<void> {
    const product = this.product();
    if (!product || !this.authService.isAuthenticated() || this.togglingFavorite()) return;
    const wasFavorite = this.isFavorite();
    this.togglingFavorite.set(true);
    try {
      if (wasFavorite) {
        await this.favoritesApi.removeFavorite(product.product_id);
        this.isFavorite.set(false);
      } else {
        await this.favoritesApi.addFavorite(product.product_id);
        this.isFavorite.set(true);
      }
    } catch {
      this.toastService.show(
        wasFavorite
          ? `Couldn't remove "${product.title}" from favorites — try again.`
          : `Couldn't add "${product.title}" to favorites — try again.`
      );
    } finally {
      this.togglingFavorite.set(false);
    }
  }
}
