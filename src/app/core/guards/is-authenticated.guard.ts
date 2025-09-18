import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs/operators';
import { hasRole } from '../helpers/auth.helpers';

export const isAuthenticatedGuard: CanActivateFn = (route, _state) => {
  const oidcSecurityService = inject(OidcSecurityService);
  const router = inject(Router);

  return oidcSecurityService.isAuthenticated$.pipe(
    take(1),
    map(({ isAuthenticated }) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        // Trigger login
        oidcSecurityService.authorize();
        return false;
      }

      // Check if route requires specific role
      const requiredRole = route.data['role'];
      if (requiredRole) {
        // Get user data to check role
        oidcSecurityService.userData$.pipe(take(1)).subscribe((userData) => {
          if (!hasRole(userData, requiredRole)) {
            // User doesn't have required role
            router.navigate(['/unauthorized']);
          }
        });
      }

      return true;
    }),
  );
};
