import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasRole = (userData: any, role: string): boolean => {
  const realm = userData?.realm_access?.roles ?? [];

  const resources = Object.values(userData?.resource_access ?? {}).flatMap(
    (r: any) => r?.roles ?? [],
  );
  return [...realm, ...resources].includes(role);
};

export const isAuthenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const router = inject(Router);
  const oidc = inject(OidcSecurityService);

  return oidc.isAuthenticated$.pipe(
    take(1),
    switchMap(({ isAuthenticated }: { isAuthenticated: boolean }) => {
      if (!isAuthenticated) {
        oidc.authorize();
        return of(false);
      }

      // Check if route requires specific role
      const requiredRole = route.data?.['role'];
      if (requiredRole) {
        return oidc.userData$.pipe(
          take(1),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          map(({ userData }: { userData: any }) => {
            if (!hasRole(userData, requiredRole)) {
              router.navigateByUrl('/');
              return false;
            }
            return true;
          }),
          catchError(() => {
            router.navigateByUrl('/');
            return of(false);
          }),
        );
      }

      return of(true);
    }),
    catchError(() => {
      router.navigateByUrl('/');
      return of(false);
    }),
  );
};
