import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { switchMap, take } from 'rxjs/operators';

/**
 * HTTP Interceptor for Automatic Bearer Token Injection
 *
 * This interceptor automatically adds the Authorization header with Bearer token
 * to all HTTP requests to secure routes (as configured in auth.config.ts).
 *
 * The angular-auth-oidc-client library provides its own authInterceptor,
 * but this custom implementation gives us more control and logging.
 *
 * Note: The library's authInterceptor is already configured in app.config.ts
 * and handles token injection automatically. This is a reference implementation
 * if you need custom behavior.
 */
export const customAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  // Get the current access token
  const token = authStore.token();

  // If token exists and request is to secure route, add Authorization header
  if (token) {
    console.log('[Auth Interceptor] Adding Bearer token to request:', req.url);

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(clonedRequest);
  }

  // No token, proceed without modification
  return next(req);
};

/**
 * Alternative implementation using Observable pattern
 * This is useful if you need to wait for token refresh
 */
export const observableAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);

  // Use the getAccessToken$ observable to get the latest token
  return authStore.getAccessToken$().pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        console.log('[Auth Interceptor] Adding Bearer token (Observable) to request:', req.url);

        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next(clonedRequest);
      }

      return next(req);
    }),
  );
};
