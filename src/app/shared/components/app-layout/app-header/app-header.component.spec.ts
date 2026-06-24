import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppHeaderComponent } from './app-header.component';

describe('AppHeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppHeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the header component', () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render the brand title', () => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-title')?.textContent).toContain('TETO TOYS');
  });
});
