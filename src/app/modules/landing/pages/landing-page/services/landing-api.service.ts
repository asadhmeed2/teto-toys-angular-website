import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parseHttpError } from '../../../../../shared/utils/error';

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
  async getProducts(page = 1, pageSize = 12, search = '', category = 'All'): Promise<ProductsResponse> {
    try {
      const url = `${this.baseUrl}/products?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
      return await firstValueFrom(this.http.get<ProductsResponse>(url, { withCredentials: true }));
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch products');
    }
  }

  // ponytail: get categories lookup list using Angular HttpClient and async/await
  async getCategories(): Promise<{ id: number; name: string; slug: string }[]> {
    try {
      const url = `${this.baseUrl}/categories`;
      return await firstValueFrom(this.http.get<{ id: number; name: string; slug: string }[]>(url, { withCredentials: true }));
    } catch (err) {
      throw parseHttpError(err, 'Failed to fetch categories');
    }
  }
}
