import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LandingApiService, Product, Part } from '../landing-page/services/landing-api.service';
import { FavoritesApiService } from '../../../favorites/pages/favorites-page/services/favorites-api.service';
import { AuthService, ToastService } from '../../../../shared/services';

@Component({
  selector: 'app-product-detail-page',
  imports: [CurrencyPipe, RouterLink, TranslatePipe],
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

  protected readonly parts = signal<Part[]>([]);
  protected readonly selectedPartIds = signal<ReadonlySet<string>>(new Set());
  protected readonly totalPrice = computed(() => {
    const base = this.product()?.price ?? 0;
    const selected = this.selectedPartIds();
    const partsTotal = this.parts()
      .filter(part => selected.has(part.part_id))
      .reduce((sum, part) => sum + part.price, 0);
    return base + partsTotal;
  });

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
      this.loadParts(state.product.part_ids);
    } else {
      this.notFound.set(true);
    }

    this.loadCategories();
  }

  private async loadParts(partIds: string[]): Promise<void> {
    if (!partIds || partIds.length === 0) return;
    try {
      const allParts = await this.landingApiService.getParts();
      this.parts.set(allParts.filter(part => partIds.includes(part.part_id)));
    } catch {
      // parts are an optional customization — a failed lookup shouldn't block the product page
    }
  }

  protected togglePart(partId: string): void {
    this.selectedPartIds.update(current => {
      const next = new Set(current);
      if (next.has(partId)) {
        next.delete(partId);
      } else {
        next.add(partId);
      }
      return next;
    });
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
