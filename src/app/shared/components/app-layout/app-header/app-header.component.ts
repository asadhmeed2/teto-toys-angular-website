import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppMascotComponent } from '../../app-mascot';
import { AuthService } from '../../../services';
import { AuthApiService } from '../../../../modules/Auth/pages/login-page/services/auth-api.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppMascotComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {

  readonly authService = inject(AuthService);
  private readonly authApiService = inject(AuthApiService);
  private readonly router = inject(Router);

  protected async logout(): Promise<void> {
    // Refresh token is stored in an HTTP-only cookie — the browser sends it automatically.
    // The backend clears the cookie on logout; no manual token handling needed here.
    try {

      await this.authApiService.logout()
    } catch (error) {
      console.error(error);

    } finally {
      this.authService.clearToken();

      this.router.navigate(['/login']);

    }
  }
}
