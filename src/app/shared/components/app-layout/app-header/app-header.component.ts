import { Component, inject, signal } from '@angular/core';
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


  protected logout(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      // ponytail: delegate the logout network request to AuthApiService
      this.authApiService.logout(token).finally(() => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      });
    } else {
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }
}

