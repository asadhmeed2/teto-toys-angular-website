import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parseHttpError } from '../../../../../shared/utils/error';
import { LanguageService } from '../../../../../shared/services';

export interface Product {
  product_id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  category: number;
  subcategory?: number | null;
  price: number;
  image_urls: string[];
  part_ids: string[];
}

export interface ProductsResponse {
  items: Product[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Part {
  part_id: string;
  title: string;
  description?: string | null;
  price: number;
  image_urls: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LandingApiService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  // ponytail: get products list using Angular HttpClient and async/await
  async getProducts(page = 1, pageSize = 12, search = '', category = 'All'): Promise<ProductsResponse> {
    try {
      const url = `${this.baseUrl}/products?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&lang=${this.languageService.current()}`;
      return await firstValueFrom(this.http.get<ProductsResponse>(url, { withCredentials: true }));
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch products');
    }
  }

  // ponytail: get categories lookup list using Angular HttpClient and async/await
  async getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
    try {
      const url = `${this.baseUrl}/categories?lang=${this.languageService.current()}`;
      return await firstValueFrom(this.http.get<{ id: number; name: string; slug: string }[]>(url, { withCredentials: true }));
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch categories');
    }
  }

  // ponytail: parts catalog is small, fetch one page big enough to cover it rather than paginating
  async getParts(): Promise<Part[]> {
    try {
      const url = `${this.baseUrl}/parts?page=1&pageSize=100&lang=${this.languageService.current()}`;
      const res = await firstValueFrom(this.http.get<{ items: Part[] }>(url, { withCredentials: true }));
      return res.items;
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch parts');
    }
  }
}
