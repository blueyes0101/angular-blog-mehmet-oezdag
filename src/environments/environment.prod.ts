export const environment = {
  production: true,
  apiUrl: '', // No backend deployed, using mock data
  mockData: true,
  auth: {
    authority: 'https://<keycloak-azure-host>/realms/<realm>',
    clientId: '<client-id>',
    scope: 'openid profile email roles',
  },
};
