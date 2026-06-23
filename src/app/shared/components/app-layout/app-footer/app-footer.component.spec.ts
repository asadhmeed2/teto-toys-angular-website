import { TestBed } from '@angular/core/testing';
import { AppFooterComponent } from './app-footer.component';

describe('AppFooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFooterComponent],
    }).compileComponents();
  });

  it('should create the footer component', () => {
    const fixture = TestBed.createComponent(AppFooterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render copyright information', () => {
    const fixture = TestBed.createComponent(AppFooterComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.copyright')?.textContent).toContain('TetoToys');
  });
});
