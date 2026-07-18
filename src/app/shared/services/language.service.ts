import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface SystemLanguage {
  code: string;
  name: string;
  is_rtl: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly baseUrl = 'http://localhost:8080/api'; // default customer C# backend
  // private readonly baseUrl = 'http://localhost:8000/api'; // flask api
  // private readonly baseUrl = 'http://localhost:3000/api'; // node api
  private readonly http = inject(HttpClient);

  readonly languages = signal<SystemLanguage[]>([]);
  readonly current = signal<string>(localStorage.getItem('lang') || 'en');

  constructor() {
    // Apply the persisted direction before any data loads so the first paint
    // is already RTL/LTR-correct.
    this.applyDirection(localStorage.getItem('lang_rtl') === '1');
  }

  async load(): Promise<void> {
    try {
      const list = await firstValueFrom(this.http.get<SystemLanguage[]>(`${this.baseUrl}/languages`));
      this.languages.set(list.map(l => ({ ...l, is_rtl: !!l.is_rtl })));
    } catch {
      // selector stays hidden; the storefront still works in the default language
    }
  }

  setLanguage(code: string): void {
    const lang = this.languages().find(l => l.code === code);
    localStorage.setItem('lang', code);
    localStorage.setItem('lang_rtl', lang?.is_rtl ? '1' : '0');
    this.current.set(code);
    this.applyDirection(!!lang?.is_rtl);
    // ponytail: full reload is the simplest way to refetch every page's data in
    // the new language; swap for signal-driven refetching if it ever feels slow
    location.reload();
  }

  private applyDirection(isRtl: boolean): void {
    document.documentElement.lang = this.current();
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }
}
