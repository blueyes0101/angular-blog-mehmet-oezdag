import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/angular-blog',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'angular-blog-client',
    scope: 'openid profile email roles',
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
