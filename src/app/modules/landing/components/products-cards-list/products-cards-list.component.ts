import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Product } from '../../pages/landing-page/services/landing-api.service';

@Component({
  selector: 'app-products-cards-list',
  imports: [CurrencyPipe, TranslatePipe],
  templateUrl: './products-cards-list.component.html',
  styleUrl: './products-cards-list.component.scss',
})
export class ProductsCardsListComponent {
  readonly products = input<Product[]>([]);
  readonly categoryMap = input<Record<number, string>>({});
  readonly favoriteIds = input<Set<string>>(new Set());
  readonly togglingFavoriteId = input<string | null>(null);
  readonly isAuthenticated = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly viewDetails = output<Product>();
  readonly toggleFavorite = output<{ event: MouseEvent; product: Product }>();
  readonly retry = output<void>();

  isFavorite(productId: string): boolean {
    return this.favoriteIds().has(productId);
  }
}
