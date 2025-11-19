// src/App.tsx

import React, { useMemo, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HomeScreen } from './screens/HomeScreen';
import { GetStartedScreen } from './screens/GetStartedScreen';
import { LoginScreen } from './screens/LoginScreen';
import { UserSummaryScreen } from './screens/UserSummaryScreen';
import { Step } from './components/StepCarousel';

type Screen = 'home' | 'getStarted' | 'login' | 'userSummary';

const steps: Step[] = [
  { title: 'Step 1', subtitle: 'Get acquainted with the flow.' },
  { title: 'Step 2', subtitle: 'Review what you need to do next.' },
  { title: 'Step 3', subtitle: 'Stay ready for the journey ahead.' },
];

export default function MainApp() {
  const [screen, setScreen] = useState<Screen>('home');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const carouselSteps = useMemo(() => steps, []);

  let currentScreen: React.ReactNode;
  if (screen === 'getStarted') {
    currentScreen = <GetStartedScreen onBack={() => setScreen('home')} />;
  } else if (screen === 'login') {
    currentScreen = (
      <LoginScreen
        onBack={() => setScreen('home')}
        onLoginSuccess={(token) => setAccessToken(token)}
        onNext={() => setScreen('userSummary')}
      />
    );
  } else if (screen === 'userSummary') {
    currentScreen = (
      <UserSummaryScreen
        accessToken={accessToken}
        onBack={() => setScreen('login')}
      />
    );
  } else {
    currentScreen = (
      <HomeScreen
        steps={carouselSteps}
        onGetStarted={() => setScreen('getStarted')}
        onLogin={() => setScreen('login')}
      />
    );
  }

  return <SafeAreaProvider>{currentScreen}</SafeAreaProvider>;
}
