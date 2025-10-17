// export const environment = {
//   production: true,
//   apiUrl: '', // No backend deployed, using mock data
//   mockData: true,
//   auth: {
//     authority: 'https://<keycloak-azure-host>/realms/<realm>',
//     clientId: '<client-id>',
//     scope: 'openid profile email roles',
//     redirectUrl: window?.location?.origin ?? 'http://localhost:4200',
//     postLogoutRedirectUri: window?.location?.origin ?? 'http://localhost:4200',
//   },
// };
export const environment = {
  production: true,
  apiUrl: 'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io',
  mockData: false,
  auth: {
    // Keycloak authority URL - MUST use 'blog' realm (not 'master')
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',

    // Keycloak client ID for this SPA
    clientId: 'spa-blog',

    // OAuth 2.0 scopes - offline_access enables refresh tokens
    scope: 'openid profile email offline_access',

    // Redirect URLs - dynamically use current origin in production
    redirectUrl: window?.location?.origin ?? 'https://your-production-url.azurestaticapps.net',
    postLogoutRedirectUri:
      window?.location?.origin ?? 'https://your-production-url.azurestaticapps.net',
  },
};
