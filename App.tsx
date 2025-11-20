// App.tsx (root)

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import MainApp from './src/App';
import { DesignSystemProvider, useDesignSystem } from './src/theme/DesignSystemProvider';

function ThemedStatusBar() {
  const { mode, tokens } = useDesignSystem();
  const backgroundColor = (tokens.primitives.colors?.background as string) ?? '#0F172A';

  return (
    <StatusBar
      style={mode === 'dark' ? 'light' : 'dark'}
      backgroundColor={backgroundColor}
      translucent={false}
    />
  );
}

export default function App() {
  return (
    <DesignSystemProvider>
      <SafeAreaProvider>
        <ThemedStatusBar />
        <MainApp />
      </SafeAreaProvider>
    </DesignSystemProvider>
  );
}
