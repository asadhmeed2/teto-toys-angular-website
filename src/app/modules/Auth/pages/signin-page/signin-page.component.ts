import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppMascotComponent } from '../../../../shared';
import { AuthApiService } from '../login-page/services/auth-api.service';

@Component({
  selector: 'app-signin-page',
  imports: [ReactiveFormsModule, RouterLink, AppMascotComponent],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss',
})
export class SigninPageComponent {
  protected readonly signupForm = new FormGroup(
    {
      firstName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      lastName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      isAdult: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
      termsAccepted: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
      marketingOptIn: new FormControl(false, { nonNullable: true }),
    },
    { validators: SigninPageComponent.passwordsMatchValidator }
  );

  protected readonly isPasswordVisible = signal(false);
  protected readonly isConfirmPasswordVisible = signal(false);
  protected readonly isPasswordFocused = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  constructor(
    private readonly router: Router,
    private readonly authApiService: AuthApiService
  ) {}

  /** Cross-field validator: password and confirmPassword must match. */
  private static passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  protected togglePasswordVisibility(): void {
    this.isPasswordVisible.update((v) => !v);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible.update((v) => !v);
  }

  protected onPasswordFocus(): void {
    this.isPasswordFocused.set(true);
  }

  protected onPasswordBlur(): void {
    this.isPasswordFocused.set(false);
  }

  protected onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const v = this.signupForm.getRawValue();

    this.authApiService
      .register({
        first_name: v.firstName,
        last_name: v.lastName,
        email: v.email,
        password: v.password,
        confirm_password: v.confirmPassword,
        is_adult: v.isAdult,
        terms_accepted: v.termsAccepted,
        marketing_opt_in: v.marketingOptIn,
      })
      .then(() => {
        this.isLoading.set(false);
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      })
      .catch((error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Registration failed. Please try again.');
      });
  }
}
