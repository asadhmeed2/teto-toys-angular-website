import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppMascotComponent } from '../../app-mascot';
import { AuthService } from '../../../services';
import { AuthApiService } from '../../../../modules/Auth/pages/login-page/services/auth-api.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AppMascotComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.menuOpen.set(false);
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
