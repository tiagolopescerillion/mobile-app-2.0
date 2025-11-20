import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useDesignSystem } from '../theme/DesignSystemProvider';

export type Step = {
  title: string;
  subtitle: string;
};

type StepCarouselProps = {
  steps: Step[];
};

export function StepCarousel({ steps }: StepCarouselProps) {
  const { tokens } = useDesignSystem();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.carouselContent}
    >
      {steps.map((step) => (
        <View key={step.title} style={styles.card}>
          <Text style={[styles.cardTitle, tokens.semantic.text.title]}>{step.title}</Text>
          <Text style={[styles.cardSubtitle, tokens.semantic.text.description]}>{step.subtitle}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const cardTokens = tokens.semantic.card.default;

  return StyleSheet.create({
    carouselContent: {
      gap: tokens.primitives.spacing.sm,
      paddingVertical: tokens.primitives.spacing.sm,
      paddingRight: tokens.primitives.spacing.xs,
    },
    card: {
      width: 240,
      borderRadius: cardTokens.borderRadius,
      backgroundColor: cardTokens.backgroundColor,
      padding: cardTokens.padding,
      elevation: cardTokens.elevation,
      borderWidth: cardTokens.borderWidth,
      borderColor: cardTokens.borderColor,
      shadowColor: tokens.primitives.palettes.neutral.black as string,
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
    },
    cardTitle: {},
    cardSubtitle: {
      marginTop: tokens.primitives.spacing.xs as number,
    },
  });
}
