import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppMascotComponent } from '../../app-mascot';
import { AuthService, LanguageService } from '../../../services';
import { AuthApiService } from '../../../../modules/Auth/pages/login-page/services/auth-api.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AppMascotComponent, TranslatePipe, UpperCasePipe],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly languageService = inject(LanguageService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.languageService.load();
  }

  readonly menuOpen = signal(false);
  readonly mobileNavOpen = signal(false);
  readonly langMenuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleMobileNav(): void {
    this.mobileNavOpen.update((v) => !v);
  }

  toggleLangMenu(): void {
    this.langMenuOpen.update((v) => !v);
  }

  selectLanguage(code: string): void {
    this.languageService.setLanguage(code);
    this.langMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-wrapper')) {
      this.menuOpen.set(false);
    }
    if (!target.closest('#lang-menu-wrapper')) {
      this.langMenuOpen.set(false);
    }
    if (!target.closest('#mobile-nav') && !target.closest('#mobile-nav-toggle')) {
      this.mobileNavOpen.set(false);
    }
  }

  protected async logout(): Promise<void> {
    this.menuOpen.set(false);
    try {
      await this.authApiService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      this.authService.clearSession();
      this.router.navigate(['/login']);
    }
  }
}
