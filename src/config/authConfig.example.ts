// src/config/authConfig.example.ts
// Template only – copy to authConfig.local.ts and fill with real values.

export const keycloakConfig = {
  authEndpoint:
    'https://your-host/auth/realms/PKADMINJ_SELF/protocol/openid-connect/auth',
  tokenEndpoint:
    'https://your-host/auth/realms/PKADMINJ_SELF/protocol/openid-connect/token',
  logoutEndpoint:
    'https://your-host/auth/realms/PKADMINJ_SELF/protocol/openid-connect/logout',
  clientId: 'your-client-id',
  realm: 'PKADMINJ_SELF',
  scope: 'openid profile email',
};
