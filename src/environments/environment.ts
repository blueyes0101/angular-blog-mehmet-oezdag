// export const environment = {
//   production: false,
//   apiUrl: 'http://localhost:3000/api',
//   mockData: false,
//   auth: {
//     authority: 'https://<keycloak-azure-host>/realms/<realm>',
//     clientId: '<client-id>',
//     scope: 'openid profile email roles',
//     redirectUrl: window?.location?.origin ?? 'http://localhost:4200',
//     postLogoutRedirectUri: window?.location?.origin ?? 'http://localhost:4200',
//   },
// };
export const environment = {
  production: false,
  apiUrl: 'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io',
  mockData: true, // Enable mock data since backend is unavailable
  auth: {
    // Keycloak authority URL - MUST use 'blog' realm (not 'master')
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',

    // Keycloak client ID for this SPA
    clientId: 'spa-blog',

    // OAuth 2.0 scopes - offline_access enables refresh tokens
    scope: 'openid profile email offline_access',

    // Redirect URLs for development
    redirectUrl: window?.location?.origin ?? 'http://localhost:4200',
    postLogoutRedirectUri: window?.location?.origin ?? 'http://localhost:4200',
  },
};
