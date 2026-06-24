import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppLayoutComponent } from './app-layout.component';

describe('AppLayoutComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLayoutComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the layout', () => {
    const fixture = TestBed.createComponent(AppLayoutComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render header and footer components', () => {
    const fixture = TestBed.createComponent(AppLayoutComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
