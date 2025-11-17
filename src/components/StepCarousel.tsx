import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export type Step = {
  title: string;
  subtitle: string;
};

type StepCarouselProps = {
  steps: Step[];
};

export function StepCarousel({ steps }: StepCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContent}
    >
      {steps.map((step) => (
        <View key={step.title} style={styles.card}>
          <Text style={styles.cardTitle}>{step.title}</Text>
          <Text style={styles.cardSubtitle}>{step.subtitle}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carouselContent: {
    gap: 12,
    paddingVertical: 12,
    paddingRight: 4,
  },
  card: {
    width: 240,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
});
