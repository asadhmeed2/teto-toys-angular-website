import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/** day_of_week: 0 = Sunday .. 6 = Saturday. Times are "HH:mm". */
export interface StoreHoursDay {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface StoreHoursResponse {
  timezone: string;
  server_time: string;
  is_open_now: boolean;
  days: StoreHoursDay[];
}

@Injectable({
  providedIn: 'root',
})
export class StoreHoursService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);

  /** null until the first successful load — the navbar hides the badge until then. */
  readonly isOpenNow = signal<boolean | null>(null);
  readonly hours = signal<StoreHoursDay[]>([]);
  readonly timezone = signal<string>('');

  async load(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<StoreHoursResponse>(`${this.baseUrl}/store-hours`),
      );
      this.isOpenNow.set(!!res.is_open_now);
      this.hours.set(res.days ?? []);
      this.timezone.set(res.timezone ?? '');
    } catch {
      // Non-fatal: leave the badge hidden rather than blocking the page.
      this.isOpenNow.set(null);
    }
  }

  /** Today's hours, for the badge tooltip. */
  todaysHours(): StoreHoursDay | null {
    const days = this.hours();
    if (!days.length) return null;
    // The server decides open/closed; this is only for display.
    const today = new Date().getDay();
    return days.find((d) => d.day_of_week === today) ?? null;
  }
}
