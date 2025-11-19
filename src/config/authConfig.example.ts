// src/config/authConfig.example.ts
// Template only – copy to authConfig.local.ts and fill with real values.

export const keycloakConfig = {
  authEndpoint:
    'https://your-host/auth/realms/PKADMINJ_SELF/protocol/openid-connect/auth',
  tokenEndpoint:
    'https://your-host/auth/realms/PKADMINJ_SELF/protocol/openid-connect/token',
  clientId: 'your-client-id',
  realm: 'PKADMINJ_SELF',
  scope: 'openid profile email',
};
