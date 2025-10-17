import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OidcSecurityService } from 'angular-auth-oidc-client';

/**
 * Centralized Authentication State Management using Angular Signals
 *
 * This store provides reactive authentication state for the entire application.
 * It wraps the OIDC library and exposes state via Angular Signals.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly #oidcSecurityService = inject(OidcSecurityService);

  /**
   * Core authentication state from OIDC library
   * Converted from Observable to Signal for reactive state management
   */
  readonly #authentication = toSignal(this.#oidcSecurityService.checkAuth());

  /**
   * Computed selectors for reactive state access
   */
  readonly isAuthenticated = computed(() => this.#authentication()?.isAuthenticated ?? false);
  readonly userData = computed(() => this.#authentication()?.userData ?? null);
  readonly token = computed(() => this.#authentication()?.accessToken ?? '');

  /**
   * JWT token decoding for role extraction from Keycloak
   * Supports both realm_access and resource_access roles
   */
  readonly roles = computed(() => {
    const token = this.token();
    if (!token) return null;

    try {
      // Decode JWT token (format: header.payload.signature)
      const payload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(payload));

      // Extract roles from different possible locations
      const realmRoles = decodedToken?.realm_access?.roles || [];
      const resourceRoles = Object.values(decodedToken?.resource_access || {}).flatMap(
        (resource: any) => resource?.roles || [],
      );

      return [...new Set([...realmRoles, ...resourceRoles])];
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  });

  /**
   * Computed property to check if user has specific role
   */
  hasRole = (role: string): boolean => {
    const userRoles = this.roles();
    return userRoles ? userRoles.includes(role) : false;
  };

  /**
   * Username extraction from user data
   */
  readonly username = computed(() => {
    const user = this.userData();
    if (!user) return null;
    return (user as any)?.preferred_username || (user as any)?.name || (user as any)?.email;
  });

  /**
   * User initials for UI display
   */
  readonly initials = computed(() => {
    const name = this.username();
    if (!name) return '';

    const parts = name.split(/[\s._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  /**
   * Trigger login flow - redirects to Keycloak
   */
  login(): void {
    console.log('[AuthStore] Initiating login flow...');
    this.#oidcSecurityService.authorize();
  }

  /**
   * Trigger logout flow - clears tokens and redirects
   */
  logout(): void {
    console.log('[AuthStore] Initiating logout flow...');
    this.#oidcSecurityService.logoffAndRevokeTokens().subscribe({
      next: () => console.log('[AuthStore] Logout successful'),
      error: (error) => console.error('[AuthStore] Logout error:', error),
    });
  }

  /**
   * Get access token as Observable (for HTTP interceptors)
   */
  getAccessToken$() {
    return this.#oidcSecurityService.getAccessToken();
  }

  /**
   * Check authentication status (triggers auth flow if needed)
   */
  checkAuth() {
    return this.#oidcSecurityService.checkAuth();
  }
}
