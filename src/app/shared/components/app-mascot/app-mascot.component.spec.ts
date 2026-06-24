import { TestBed } from '@angular/core/testing';
import { AppMascotComponent } from './app-mascot.component';

describe('AppMascotComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMascotComponent],
    }).compileComponents();
  });

  it('should create the mascot component', () => {
    const fixture = TestBed.createComponent(AppMascotComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should apply custom dimensions', () => {
    const fixture = TestBed.createComponent(AppMascotComponent);
    fixture.componentRef.setInput('width', '50px');
    fixture.componentRef.setInput('height', '60px');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('.mascot-svg');
    expect(svg?.getAttribute('width')).toBe('50px');
    expect(svg?.getAttribute('height')).toBe('60px');
  });

  it('should toggle password-focused class', () => {
    const fixture = TestBed.createComponent(AppMascotComponent);
    fixture.componentRef.setInput('passwordFocused', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const svg = compiled.querySelector('.mascot-svg');
    expect(svg?.classList.contains('password-focused')).toBe(true);
  });
});
