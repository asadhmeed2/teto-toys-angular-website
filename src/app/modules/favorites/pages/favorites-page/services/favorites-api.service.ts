import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parseHttpError } from '../../../../../shared/utils/error';
import { Product } from '../../../../landing/pages/landing-page/services/landing-api.service';

export interface FavoritesResponse {
  items: Product[];
}

export interface FavoriteIdsResponse {
  ids: string[];
}

export interface FavoriteToggleResponse {
  product_id: string;
  is_favorite: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesApiService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);

  async getFavorites(): Promise<FavoritesResponse> {
    try {
      return await firstValueFrom(
        this.http.get<FavoritesResponse>(`${this.baseUrl}/favorites`, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch favourites');
    }
  }

  async getFavoriteIds(): Promise<string[]> {
    try {
      const res = await firstValueFrom(
        this.http.get<FavoriteIdsResponse>(`${this.baseUrl}/favorites/ids`, { withCredentials: true })
      );
      return res.ids ?? [];
    } catch {
      return [];
    }
  }

  async addFavorite(productId: string): Promise<FavoriteToggleResponse> {
    try {
      return await firstValueFrom(
        this.http.post<FavoriteToggleResponse>(`${this.baseUrl}/favorites/${productId}`, {}, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Failed to add to favourites');
    }
  }

  async removeFavorite(productId: string): Promise<FavoriteToggleResponse> {
    try {
      return await firstValueFrom(
        this.http.delete<FavoriteToggleResponse>(`${this.baseUrl}/favorites/${productId}`, { withCredentials: true })
      );
    } catch (err) {
      throw parseHttpError(err, 'Failed to remove from favourites');
    }
  }
}
