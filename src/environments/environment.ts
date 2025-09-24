export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  mockData: false,
  auth: {
    authority: 'https://<keycloak-azure-host>/realms/<realm>',
    clientId: '<client-id>',
    scope: 'openid profile email roles',
    redirectUrl: window?.location?.origin ?? 'http://localhost:4200',
    postLogoutRedirectUri: window?.location?.origin ?? 'http://localhost:4200',
  },
};
