import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product {
  product_id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  category: number;
  subcategory?: number | null;
  price: number;
  image_urls: string[];
}

export interface ProductsResponse {
  items: Product[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class LandingApiService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);

  // ponytail: get products list using Angular HttpClient and async/await
  async getProducts(page = 1, pageSize = 12, search = ''): Promise<ProductsResponse> {
    try {
      const url = `${this.baseUrl}/products?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
      return await firstValueFrom(this.http.get<ProductsResponse>(url, { withCredentials: true }));
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Failed to fetch products');
      }
      throw err;
    }
  }

  // ponytail: get categories lookup list using Angular HttpClient and async/await
  async getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
    try {
      const url = `${this.baseUrl}/categories`;
      return await firstValueFrom(this.http.get<{ id: number; name: string; slug: string }[]>(url, { withCredentials: true }));
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        throw new Error(err.error?.error_description || err.error?.error || err.message || 'Failed to fetch categories');
      }
      throw err;
    }
  }
}
