import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptors';
import { AuthService } from './shared/services';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Hydrate the session from the httpOnly refresh_token cookie before the app renders,
    // so route guards and the header see accurate auth state on first paint.
    provideAppInitializer(() => inject(AuthService).tryRestoreSession()),
  ]
};
