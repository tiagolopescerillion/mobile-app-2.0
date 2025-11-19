// src/App.tsx

import React, { useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

type Screen = 'home' | 'getStarted' | 'login' | 'userSummary';

const steps: Step[] = [
  { title: 'Step 1', subtitle: 'Get acquainted with the flow.' },
  { title: 'Step 2', subtitle: 'Review what you need to do next.' },
  { title: 'Step 3', subtitle: 'Stay ready for the journey ahead.' },
];

export default function MainApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);

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
        onLogin={() =>
          isLoggedIn ? handleLogout() : setScreen('login')
        }
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return <SafeAreaProvider>{currentScreen}</SafeAreaProvider>;
}
