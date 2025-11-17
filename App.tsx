// App.tsx (root)

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MainApp from './src/App';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        style="light"            // light icons on iOS *and* Android
        backgroundColor="#0F172A" // Android only, ignored on iOS
        translucent={false}
      />
      <MainApp />
    </SafeAreaProvider>
  );
}
