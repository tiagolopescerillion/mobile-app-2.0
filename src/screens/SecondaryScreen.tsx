import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SecondaryScreenProps = {
  heading: string;
  onBack: () => void;
};

export function SecondaryScreen({ heading, onBack }: SecondaryScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.secondaryContainer}>
        <Text style={styles.secondaryHeading}>{heading}</Text>
        <Text style={styles.secondaryCopy}>This screen is ready for your future content.</Text>
        <Pressable style={[styles.button, styles.outlineButton]} onPress={onBack}>
          <Text style={[styles.buttonLabel, styles.outlineLabel]}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  secondaryContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 16,
  },
  secondaryHeading: {
    fontWeight: '700',
    fontSize: 28,
    color: '#0f172a',
  },
  secondaryCopy: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  outlineLabel: {
    color: '#2563eb',
  },
});
