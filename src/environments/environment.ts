export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  mockData: false,
  auth: {
    authority: 'https://<keycloak-azure-host>/realms/<realm>',
    clientId: '<client-id>',
    scope: 'openid profile email roles',
  },
};
