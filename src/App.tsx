// src/App.tsx

import React, { useMemo, useState } from 'react';
import { Switch, Text, View, StyleSheet } from 'react-native';

import { HomeScreen } from './screens/HomeScreen';
import { GetStartedScreen } from './screens/GetStartedScreen';
import { LoginScreen } from './screens/LoginScreen';
import { UserSummaryScreen } from './screens/UserSummaryScreen';
import { Step } from './components/StepCarousel';
import {
  AuthTokens,
  LogoutResult,
  logoutFromKeycloak,
} from './services/keycloakAuthService';
import { SharedWebviewProvider } from './context/SharedWebviewProvider';
import { AccountProvider } from './context/AccountContext';
import { useDesignSystem } from './theme/DesignSystemProvider';

type Screen = 'home' | 'getStarted' | 'login' | 'userSummary';

const steps: Step[] = [
  { title: 'Step 1', subtitle: 'Get acquainted with the flow.' },
  { title: 'Step 2', subtitle: 'Review what you need to do next.' },
  { title: 'Step 3', subtitle: 'Stay ready for the journey ahead.' },
];

export default function MainApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);

  const { mode, tokens, setMode } = useDesignSystem();

  const carouselSteps = useMemo(() => steps, []);

  const isLoggedIn = Boolean(authTokens?.accessToken);

  const handleLoginSuccess = (tokens: AuthTokens) => {
    setAuthTokens(tokens);
  };

  const handleLogout = async (): Promise<LogoutResult> => {
    let result: LogoutResult = { ok: true };
    try {
      if (authTokens?.refreshToken) {
        result = await logoutFromKeycloak(authTokens.refreshToken);
      }
    } catch (error: any) {
      result = { ok: false, error: String(error?.message ?? error) };
    }

    setAuthTokens(null);
    return result;
  };

  let currentScreen: React.ReactNode;
  if (screen === 'getStarted') {
    currentScreen = <GetStartedScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'login') {
    currentScreen = (
      <LoginScreen
        onBack={() => setScreen('home')}
        onLoginSuccess={handleLoginSuccess}
        onNext={() => setScreen('userSummary')}
        onLogout={handleLogout}
        isLoggedIn={isLoggedIn}
      />
    );
  } else if (screen === 'userSummary') {
    currentScreen = (
      <UserSummaryScreen
        accessToken={authTokens?.accessToken ?? null}
        onBack={() => setScreen('login')}
      />
    );
  } else {
    currentScreen = (
      <HomeScreen
        steps={carouselSteps}
        onGetStarted={() => setScreen('getStarted')}
        onLogin={() => (isLoggedIn ? handleLogout() : setScreen('login'))}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  const containerStyle = useMemo(
    () => [
      styles.appContainer,
      {
        backgroundColor:
          (tokens.semantic.page.default.backgroundColor as string) ?? '#ffffff',
        paddingHorizontal:
          (tokens.semantic.page.default.paddingHorizontal as number) ?? 16,
        paddingVertical: (tokens.semantic.page.default.paddingVertical as number) ?? 16,
      },
    ],
    [tokens.semantic.page.default]
  );

  return (
    <AccountProvider>
      <SharedWebviewProvider>
        <View style={containerStyle}>
          <View style={styles.themeSwitchRow}>
            <Text style={[styles.themeLabel, tokens.semantic.text.body]}>Theme</Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={(value) => setMode(value ? 'dark' : 'light')}
              thumbColor={
                mode === 'dark'
                  ? (tokens.primitives.palettes.primary.base as string)
                  : (tokens.primitives.palettes.neutral.white as string)
              }
              trackColor={{
                false: tokens.primitives.palettes.neutral['200'] as string,
                true: tokens.primitives.palettes.primary.light as string,
              }}
            />
          </View>
          {currentScreen}
        </View>
      </SharedWebviewProvider>
    </AccountProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  themeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    gap: 8,
  },
  themeLabel: {
    fontWeight: '600',
  },
});
