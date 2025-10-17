import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';

/**
 * OIDC Configuration for Keycloak Authentication
 *
 * This configuration implements the OAuth 2.0 Authorization Code Flow with PKCE
 * for secure authentication in Single Page Applications.
 *
 * Key Features:
 * - Authorization Code Flow (most secure for SPAs)
 * - PKCE (Proof Key for Code Exchange) - automatic
 * - Silent token renewal via iframe
 * - Refresh token support
 * - Automatic user info fetching
 */
export const authConfig: PassedInitialConfig = {
  config: {
    // Keycloak authority URL (realm endpoint)
    authority: environment.auth.authority,

    // OAuth 2.0 redirect URLs
    redirectUrl: environment.auth.redirectUrl,
    postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,

    // Public client ID (no client secret for SPAs)
    clientId: environment.auth.clientId,

    // OAuth 2.0 scopes
    scope: environment.auth.scope,

    // Authorization Code Flow (NOT Implicit Flow)
    responseType: 'code',

    // Silent token renewal configuration
    silentRenew: true,
    silentRenewUrl: `${environment.auth.redirectUrl}/silent-renew.html`,
    renewTimeBeforeTokenExpiresInSeconds: 10,

    // Refresh token support
    useRefreshToken: true,

    // Automatically fetch user info after authentication
    autoUserInfo: true,

    // Security settings
    ignoreNonceAfterRefresh: true,

    // Secure routes that require Bearer tokens
    secureRoutes: [environment.apiUrl],

    // Logging (0 = None, 1 = Error, 2 = Warn, 3 = Debug)
    logLevel: 0,

    // Custom OAuth parameters
    customParamsAuthRequest: {
      // Forces account selection on login
      prompt: 'select_account',
    },
  },
};
