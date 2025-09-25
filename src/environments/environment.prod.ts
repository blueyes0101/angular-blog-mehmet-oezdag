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
  apiUrl: '', // No backend deployed, using mock data
  mockData: true,
  auth: {
    // Hocanın verdiği Keycloak host + realm: master
    authority:
      'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/master',

    // !!! Burası önemli: clientId'yi öğretmenden alman gerek (public SPA client).
    // Sıklıkla 'angular', 'spa', 'frontend' gibi olur.
    clientId: '<PUT_NEED_CLIENT_ID_HERE>',

    scope: 'openid profile email',
    redirectUrl: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
};
