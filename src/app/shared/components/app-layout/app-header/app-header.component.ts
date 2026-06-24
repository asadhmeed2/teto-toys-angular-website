import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppMascotComponent } from '../../app-mascot';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppMascotComponent],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  protected readonly isLoggedIn = signal<boolean>(false);

  constructor(private readonly router: Router) {
    this.checkLoginStatus();
  }

  protected checkLoginStatus(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.isLoggedIn.set(!!localStorage.getItem('access_token'));
    }
  }

  protected logout(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch('http://localhost:5063/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).finally(() => {
        localStorage.removeItem('access_token');
        this.isLoggedIn.set(false);
        this.router.navigate(['/login']);
      });
    }
  }
}

