import { Component, inject, signal, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../login-page/services/auth-api.service';

@Component({
  selector: 'app-reset-password-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent implements OnInit {
  protected readonly form = new FormGroup({
    new_password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    confirm_password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly isLoading = signal(false);
  protected readonly isPasswordVisible = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly tokenMissing = signal(false);

  private token = '';
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authApiService = inject(AuthApiService);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.tokenMissing.set(true);
    }
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected onSubmit(): void {
    if (this.form.invalid || !this.token) return;

    const { new_password, confirm_password } = this.form.getRawValue();

    if (new_password !== confirm_password) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authApiService.resetPassword(this.token, new_password, confirm_password)
      .then(() => {
        this.isLoading.set(false);
        this.successMessage.set('Password reset successfully! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      })
      .catch((err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Something went wrong. Please try again.');
      });
  }
}
