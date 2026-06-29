import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AppMascotComponent, AuthService } from '../../../../shared';
import { AuthApiService } from './services/auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, AppMascotComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)]
    }),
  });

  protected readonly isPasswordVisible = signal(false);
  protected readonly isPasswordFocused = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  private readonly route = inject(ActivatedRoute);

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly authApiService: AuthApiService
  ) {
    if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
      this.successMessage.set('Account created successfully! Please sign in.');
    }
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected onPasswordFocus(): void {
    this.isPasswordFocused.set(true);
  }

  protected onPasswordBlur(): void {
    this.isPasswordFocused.set(false);
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;

    // ponytail: delegating the api call to the service using native fetch to keep dependencies light
    this.authApiService.login(email, password)
      .then((data) => {
        this.authService.setToken(data.access_token);
        this.isLoading.set(false);
        this.router.navigate(['/landing']);
      })
      .catch((error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Connection error. Please try again.');
      });
  }
}

