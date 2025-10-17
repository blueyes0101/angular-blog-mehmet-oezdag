import { inject } from '@angular/core';
import {
  Router,
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthStore } from '../auth/auth.store';

/**
 * Modern Functional Auth Guard with Role-Based Authorization
 *
 * This guard implements two-level security:
 * 1. Authentication Check: Is the user logged in?
 * 2. Role Check: Does the user have the required role?
 *
 * Usage in routes:
 * {
 *   path: 'add-blog',
 *   canActivate: [authGuard],
 *   data: { role: 'user' }  // Optional: specific role requirement
 * }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot,
) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  console.log('[Auth Guard] Checking authentication...');

  // Check if user is authenticated
  if (!authStore.isAuthenticated()) {
    console.log('[Auth Guard] User not authenticated, redirecting to login...');
    authStore.login();
    return false;
  }

  // Check role-based authorization if required
  const requiredRole = route.data['role'] as string;
  if (requiredRole) {
    const userRoles = authStore.roles();
    console.log('[Auth Guard] Required role:', requiredRole);
    console.log('[Auth Guard] User roles:', userRoles);

    if (!userRoles || !userRoles.includes(requiredRole)) {
      console.warn('[Auth Guard] User lacks required role, redirecting to unauthorized...');
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  console.log('[Auth Guard] Access granted');
  return true;
};

/**
 * Simple Authentication Guard (no role check)
 * Use this when you only need to verify the user is logged in
 */
export const isAuthenticatedGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);

  console.log('[IsAuthenticated Guard] Checking authentication...');

  if (!authStore.isAuthenticated()) {
    console.log('[IsAuthenticated Guard] User not authenticated, redirecting to login...');
    authStore.login();
    return false;
  }

  console.log('[IsAuthenticated Guard] User authenticated');
  return true;
};

/**
 * Role-specific guard factory
 * Creates a guard that checks for a specific role
 *
 * Usage:
 * canActivate: [roleGuard('admin')]
 */
export function roleGuard(requiredRole: string): CanActivateFn {
  return () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    console.log(`[Role Guard] Checking for role: ${requiredRole}`);

    if (!authStore.isAuthenticated()) {
      console.log('[Role Guard] User not authenticated, redirecting to login...');
      authStore.login();
      return false;
    }

    const userRoles = authStore.roles();
    if (!userRoles || !userRoles.includes(requiredRole)) {
      console.warn(`[Role Guard] User lacks required role: ${requiredRole}`);
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('[Role Guard] Access granted');
    return true;
  };
}
