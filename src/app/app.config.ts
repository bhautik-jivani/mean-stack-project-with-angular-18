import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptors } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([authInterceptors])
    ),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    provideAnimationsAsync(),
    AuthGuard
  ]
};
