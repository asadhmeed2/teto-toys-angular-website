import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, ReactiveFormsModule],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the login page component', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    expect(component['loginForm'].valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    const emailControl = component['loginForm'].controls.email;

    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalsy();

    emailControl.setValue('test@example.com');
    expect(emailControl.valid).toBeTruthy();
  });

  it('should validate password length', () => {
    const fixture = TestBed.createComponent(LoginPageComponent);
    const component = fixture.componentInstance;
    const passwordControl = component['loginForm'].controls.password;

    passwordControl.setValue('123');
    expect(passwordControl.valid).toBeFalsy();

    passwordControl.setValue('password123');
    expect(passwordControl.valid).toBeTruthy();
  });
});
