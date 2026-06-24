import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppMascotComponent, AuthService } from '../../..';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppMascotComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {

  readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  protected logout(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch('http://localhost:5063/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).finally(() => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      });
    } else {
      this.authService.clearToken();
      this.router.navigate(['/login']);
    }
  }
}

