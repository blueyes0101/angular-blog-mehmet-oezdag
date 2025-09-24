import { Injectable, inject } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private oidc = inject(OidcSecurityService);

  isAuthenticated$ = this.oidc.isAuthenticated$.pipe(map((s) => s.isAuthenticated));
  userData$ = this.oidc.userData$;
  accessToken$ = this.oidc.getAccessToken();

  login() {
    this.oidc.authorize();
  }

  logout() {
    return this.oidc.logoffAndRevokeTokens();
  }

  hasRole(userData: any, role: string): boolean {
    const realm = userData?.realm_access?.roles ?? [];
    const resRoles = Object.values(userData?.resource_access ?? {}).flatMap(
      (r: any) => r?.roles ?? [],
    );
    return [...realm, ...resRoles].includes(role);
  }

  usernameFrom(userData: any): string | undefined {
    return userData?.preferred_username || userData?.name || userData?.email;
  }
}
