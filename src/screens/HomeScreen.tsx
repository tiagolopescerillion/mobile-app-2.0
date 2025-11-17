import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StepCarousel, Step } from '../components/StepCarousel';

type HomeScreenProps = {
  steps: Step[];
  onGetStarted: () => void;
  onLogin: () => void;
};

export function HomeScreen({ steps, onGetStarted, onLogin }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Welcome</Text>
        <Text style={styles.pageSubtitle}>
          Start with these simple steps to set everything in motion.
        </Text>
        <StepCarousel steps={steps} />
        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={onGetStarted}>
            <Text style={[styles.buttonLabel, styles.primaryLabel]}>Get Start</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.outlineButton]} onPress={onLogin}>
            <Text style={[styles.buttonLabel, styles.outlineLabel]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 16,
  },
  pageTitle: {
    fontWeight: '700',
    fontSize: 28,
    color: '#0f172a',
  },
  pageSubtitle: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  primaryLabel: {
    color: '#ffffff',
  },
  outlineLabel: {
    color: '#2563eb',
  },
});
