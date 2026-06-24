import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
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

  constructor(private readonly router: Router) {}

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

    // Mock API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/landing']);
    }, 1500);
  }
}
