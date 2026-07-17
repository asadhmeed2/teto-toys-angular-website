import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { parseHttpError } from '../../../../../shared/utils/error';

export interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactApiService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);

  async submitContact(request: ContactRequest): Promise<ContactResponse> {
    try {
      return await firstValueFrom(
        this.http.post<ContactResponse>(`${this.baseUrl}/contact`, request),
      );
    } catch (err) {
      throw parseHttpError(err, 'Failed to send message');
    }
  }
}
