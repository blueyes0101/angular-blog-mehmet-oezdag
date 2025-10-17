import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth } from 'angular-auth-oidc-client';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authConfig } from './core/config/auth.config';

/**
 * Application Configuration
 *
 * This configuration sets up:
 * - Router with lazy-loaded modules
 * - HTTP client with fetch API and interceptors
 * - Authentication with OIDC/Keycloak
 * - Internationalization (i18n) with ngx-translate
 * - Material Design animations
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Performance optimization
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router configuration
    provideRouter(routes),

    // HTTP Client with modern fetch API and legacy class-based interceptors
    // Note: Using withInterceptorsFromDi() to support the OIDC library's authInterceptor
    provideHttpClient(
      withFetch(), // Use Fetch API instead of XHR
      withInterceptorsFromDi(), // Enable class-based interceptors for OIDC
    ),

    // Material Design animations
    provideAnimationsAsync(),

    // OIDC Authentication with Keycloak
    // This automatically sets up:
    // - OidcSecurityService for auth operations
    // - authInterceptor for Bearer token injection
    // - Silent token renewal mechanism
    provideAuth(authConfig),

    // Configure ngx-translate with TranslateHttpLoader
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json',
      },
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useClass: TranslateHttpLoader,
        },
      }),
    ),
  ],
};
