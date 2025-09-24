import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from '../../../environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.auth.authority,
    redirectUrl: environment.auth.redirectUrl,
    postLogoutRedirectUri: environment.auth.postLogoutRedirectUri,
    clientId: environment.auth.clientId,
    scope: environment.auth.scope,
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30,
    ignoreNonceAfterRefresh: true,
    autoUserInfo: true,
    logLevel: 0, // LogLevel.Debug for debugging
    customParamsAuthRequest: {
      prompt: 'select_account', // Forces account selection
    },
  },
};
