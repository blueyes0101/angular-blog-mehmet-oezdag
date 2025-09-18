import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
// import { OidcSecurityService } from 'angular-auth-oidc-client'; // Temporarily disabled
import { MockOidcSecurityService } from '../services/mock-oidc.service';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { hasRole } from '../helpers/auth.helpers';

export const isAuthenticatedGuard: CanActivateFn = (route, _state) => {
  const oidcSecurityService = inject(MockOidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1),
    switchMap(({ isAuthenticated }) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Trigger login
        oidcSecurityService.authorize();
        return of(false);
      }

      // Check if route requires specific role
      const requiredRole = route.data['role'];
      if (requiredRole) {
        // Get user data to check role
        return oidcSecurityService.userData$.pipe(
          take(1),
          map((userData) => {
            if (!hasRole(userData, requiredRole)) {
              // User doesn't have required role
              router.navigate(['/unauthorized']);
              return false;
            }
            return true;
          }),
          catchError(() => {
            router.navigate(['/unauthorized']);
            return of(false);
          })
        );
      }

      return of(true);
    }),
    catchError(() => {
      router.navigate(['/unauthorized']);
      return of(false);
    })
  );
};
