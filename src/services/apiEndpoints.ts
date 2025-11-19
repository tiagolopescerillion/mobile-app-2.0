// src/services/apiEndpoints.ts
// Central registry for backend endpoints so they can be reused across screens.

export const apiEndpoints = {
  findUser: 'https://lonlinux13.cerillion.com:49987/apiman-gateway/CSS-MASTER-ORG/findUser/1.0',
} as const;

export type ApiEndpointKey = keyof typeof apiEndpoints;
