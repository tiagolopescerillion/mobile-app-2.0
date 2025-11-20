// src/modules/user/LoginScreen.tsx
import React, { useMemo, useState } from 'react';
import { Pressable, View, Text, Button, ScrollView, StyleSheet, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Update the import path if the file exists elsewhere, for example:
import {
  AuthTokens,
  LogoutResult,
  loginWithKeycloak,
} from '../services/keycloakAuthService';
// Or create src/services/auth/keycloakAuthService.ts and export loginWithKeycloak from it.
import { useDesignSystem } from '../theme/DesignSystemProvider';

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
  const { tokens } = useDesignSystem();

  const styles = useMemo(() => createStyles(tokens), [tokens]);

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
        <Text style={[styles.title, tokens.semantic.text.title]}>Keycloak Login</Text>
        <Text style={[styles.subtitle, tokens.semantic.text.description]}>
          Press the button below to open the Keycloak login page.
        </Text>

        <View style={styles.buttonContainer}>
          {!isLoggedIn ? (
            <Button
              title={loading ? 'Logging in…' : 'Login with Keycloak'}
              onPress={handleLoginPress}
              disabled={loading}
              color={tokens.semantic.button.primary.backgroundDefault as string}
            />
          ) : (
            <Button
              title={loading ? 'Logging out…' : 'Logout of Keycloak'}
              onPress={handleLogoutPress}
              disabled={loading}
              color={tokens.primitives.palettes.secondary.dark as string}
            />
          )}
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressButton}>
            <Button title="Back" onPress={onBack} color={tokens.primitives.palettes.neutral['700'] as string} />
          </View>
          {isLoggedIn && (
            <View style={[styles.progressButton, styles.progressButtonSpacing]}>
              <Pressable
                style={[styles.primaryNextButton, loading && styles.nextButtonDisabled]}
                onPress={onNext}
                disabled={loading}
              >
                <Text style={[styles.nextButtonLabel, tokens.semantic.text.body]}>
                  Next: user details
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <Text style={[styles.debugTitle, tokens.semantic.text.body]}>Debug output</Text>
        <ScrollView style={styles.debugBox}>
          <Text style={[styles.debugText, tokens.semantic.text.caption]}>
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

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const primaryButton = tokens.semantic.button.primary;
  const pageDefaults = tokens.semantic.page.surface;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: tokens.semantic.page.default.backgroundColor,
    },
    container: {
      flex: 1,
      paddingHorizontal: pageDefaults.paddingHorizontal ?? tokens.primitives.spacing.md,
      paddingTop: pageDefaults.paddingVertical ?? tokens.primitives.spacing.md,
      paddingBottom: tokens.primitives.spacing.lg,
      gap: tokens.primitives.spacing.sm,
    },
    title: {},
    subtitle: {},
    buttonContainer: {
      marginBottom: tokens.primitives.spacing.md,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: tokens.primitives.spacing.md,
      gap: tokens.primitives.spacing.sm,
    },
    progressButton: {
      flex: 1,
    },
    progressButtonSpacing: {
      marginLeft: tokens.primitives.spacing.sm,
    },
    primaryNextButton: {
      backgroundColor: primaryButton.backgroundDefault,
      paddingVertical: primaryButton.paddingVertical,
      borderRadius: primaryButton.borderRadius,
      alignItems: 'center',
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    nextButtonLabel: {
      color: primaryButton.textColorDefault,
      fontWeight: `${primaryButton.fontWeight}` as TextStyle['fontWeight'],
      fontSize: primaryButton.fontSize,
    },
    debugTitle: {},
    debugBox: {
      flex: 1,
      borderWidth: tokens.primitives.borderWidth.thin as number,
      borderColor: tokens.primitives.colors.border as string,
      borderRadius: tokens.primitives.radius.md as number,
      padding: tokens.primitives.spacing.sm as number,
      backgroundColor: tokens.primitives.colors.surface as string,
    },
    debugText: {
      fontFamily: tokens.primitives.typography.fontFamilyMono as string,
    },
  });
}
