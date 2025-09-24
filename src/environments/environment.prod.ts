export const environment = {
  production: true,
  apiUrl: '', // No backend deployed, using mock data
  mockData: true,
  auth: {
    authority: 'https://<keycloak-azure-host>/realms/<realm>',
    clientId: '<client-id>',
    scope: 'openid profile email roles',
    redirectUrl: window?.location?.origin ?? 'http://localhost:4200',
    postLogoutRedirectUri: window?.location?.origin ?? 'http://localhost:4200',
  },
};
