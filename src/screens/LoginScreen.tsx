// src/modules/user/LoginScreen.tsx
import React, { useState } from 'react';
import { Pressable, View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Update the import path if the file exists elsewhere, for example:
import {
  AuthTokens,
  LogoutResult,
  loginWithKeycloak,
} from '../services/keycloakAuthService';
// Or create src/services/auth/keycloakAuthService.ts and export loginWithKeycloak from it.

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (tokens: AuthTokens) => void;
  onNext: () => void;
  onLogout: () => Promise<LogoutResult>;
  isLoggedIn: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onLoginSuccess,
  onNext,
  onLogout,
  isLoggedIn,
}) => {
  const [debugText, setDebugText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLoginPress = async () => {
    setLoading(true);
    setDebugText('Starting Keycloak login…');
    try {
      const result = await loginWithKeycloak();

      if (result.ok) {
        const shortAccessToken =
          result.accessToken?.substring(0, 60) + '…';

        setDebugText(
          [
            '✅ Login SUCCESS',
            '',
            `Access token (first 60 chars):`,
            shortAccessToken,
            '',
            'Raw token response (stringified):',
          JSON.stringify(result.raw, null, 2),
        ].join('\n')
        );
        if (result.accessToken) {
          onLoginSuccess({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            idToken: result.idToken,
          });
        }
      } else {
        setDebugText(
          [
            '❌ Login FAILED',
            '',
            result.error,
            '',
            'Raw result (if any):',
            JSON.stringify(result.raw, null, 2),
          ].join('\n')
        );
      }
    } catch (e: any) {
      setDebugText(`❌ Unexpected error: ${String(e?.message ?? e)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = async () => {
    setLoading(true);
    setDebugText('Logging out…');
    try {
      const result = await onLogout();

      if (result.ok) {
        setDebugText('✅ Logout SUCCESS\nYou have been signed out.');
      } else {
        setDebugText(
          [
            '❌ Logout FAILED',
            '',
            result.error,
          ].join('\n')
        );
      }
    } catch (error: any) {
      setDebugText(
        `❌ Logout failed: ${String(error?.message ?? error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.container}>
        <Text style={styles.title}>Keycloak Login</Text>
        <Text style={styles.subtitle}>
          Press the button below to open the Keycloak login page.
        </Text>

        <View style={styles.buttonContainer}>
          {!isLoggedIn ? (
            <Button
              title={loading ? 'Logging in…' : 'Login with Keycloak'}
              onPress={handleLoginPress}
              disabled={loading}
            />
          ) : (
            <Button
              title={loading ? 'Logging out…' : 'Logout of Keycloak'}
              onPress={handleLogoutPress}
              disabled={loading}
              color="#b91c1c"
            />
          )}
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressButton}>
            <Button title="Back" onPress={onBack} />
          </View>
          {isLoggedIn && (
            <View style={[styles.progressButton, styles.progressButtonSpacing]}>
              <Pressable
                style={[styles.primaryNextButton, loading && styles.nextButtonDisabled]}
                onPress={onNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonLabel}>Next: user details</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={styles.debugTitle}>Debug output</Text>
        <ScrollView style={styles.debugBox}>
          <Text style={styles.debugText}>
            {debugText ||
              (isLoggedIn
                ? 'You are currently logged in.'
                : 'No login attempt yet.')}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressButton: {
    flex: 1,
  },
  progressButtonSpacing: {
    marginLeft: 12,
  },
  primaryNextButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  debugBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f9fafb',
  },
  debugText: {
    fontFamily: 'System',
    fontSize: 12,
  },
});
