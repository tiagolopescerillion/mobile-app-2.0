// src/services/auth/keycloakAuthService.ts

import * as AuthSession from 'expo-auth-session';
import { keycloakConfig } from '../config/authConfig';

// Redirect URI for this app / environment.
// In Expo Go this will look like: exp://127.0.0.1:8081 or similar.
export const redirectUri = AuthSession.makeRedirectUri();

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
};

export type AuthDebugResult =
  | { ok: true; accessToken: string; refreshToken?: string; idToken?: string; raw: any }
  | { ok: false; error: string; raw?: any };

export type LogoutResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginWithKeycloak(): Promise<AuthDebugResult> {
  // 1. Build discovery document (Auth + Token endpoints)
  const discovery: AuthSession.DiscoveryDocument = {
    authorizationEndpoint: keycloakConfig.authEndpoint,
    tokenEndpoint: keycloakConfig.tokenEndpoint,
  };

  // 2. Create the auth request (with PKCE)
  const request = new AuthSession.AuthRequest({
    clientId: keycloakConfig.clientId,
    responseType: AuthSession.ResponseType.Code,
    redirectUri,
    scopes: keycloakConfig.scope.split(/\s+/),
    usePKCE: true,
  });

  // 3. (Optional) Log the URL that will be used
  const authUrl = await request.makeAuthUrlAsync(discovery);
  console.log('Keycloak auth URL:', authUrl);

  // 4. Open browser and wait for the result
  const result = await request.promptAsync(discovery);

  if (result.type !== 'success' || !result.params?.code) {
    return {
      ok: false,
      error: `Auth failed or was cancelled: ${JSON.stringify(result)}`,
      raw: result,
    };
  }

  const authorizationCode = result.params.code as string;

  try {
    // 5. Exchange authorization code for tokens
    const tokenResult = await AuthSession.exchangeCodeAsync(
      {
        code: authorizationCode,
        clientId: keycloakConfig.clientId,
        redirectUri,
        extraParams: {
          // PKCE: send the verifier back
          code_verifier: request.codeVerifier || '',
        },
      },
      {
        tokenEndpoint: keycloakConfig.tokenEndpoint,
      }
    );

    return {
      ok: true,
      accessToken: tokenResult.accessToken ?? '',
      refreshToken: tokenResult.refreshToken ?? undefined,
      idToken: tokenResult.idToken ?? undefined,
      raw: tokenResult,
    };
  } catch (e: any) {
    return {
      ok: false,
      error: `Token exchange failed: ${String(e?.message ?? e)}`,
    };
  }
}

export async function logoutFromKeycloak(
  refreshToken?: string
): Promise<LogoutResult> {
  if (!refreshToken || !keycloakConfig.logoutEndpoint) {
    return { ok: true };
  }

  try {
    const response = await fetch(keycloakConfig.logoutEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: keycloakConfig.clientId,
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Logout request failed: ${response.status} ${body}`);
    }

    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      error: String(error?.message ?? error),
    };
  }
}
