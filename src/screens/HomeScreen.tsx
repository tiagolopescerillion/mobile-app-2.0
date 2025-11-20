import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StepCarousel, Step } from '../components/StepCarousel';
import { useDesignSystem } from '../theme/DesignSystemProvider';

type HomeScreenProps = {
  steps: Step[];
  onGetStarted: () => void;
  onLogin: () => void | Promise<void>;
  isLoggedIn: boolean;
};

export function HomeScreen({
  steps,
  onGetStarted,
  onLogin,
  isLoggedIn,
}: HomeScreenProps) {
  const { tokens } = useDesignSystem();

  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const pageTokens = tokens.semantic.page.default as Record<string, unknown>;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: pageTokens.backgroundColor as string }]}
      edges={['top', 'right', 'bottom', 'left']}
    >
      <View style={styles.container}>
        <Text style={[styles.pageTitle, tokens.semantic.text.title]}>Welcome</Text>
        <Text style={[styles.pageSubtitle, tokens.semantic.text.description]}>
          Start with these simple steps to set everything in motion.
        </Text>
        <StepCarousel steps={steps} />
        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.primaryButton]} onPress={onGetStarted}>
            <Text style={[styles.buttonLabel, styles.primaryLabel]} accessibilityRole="button">
              Get Start
            </Text>
          </Pressable>
          <Pressable style={[styles.button, styles.outlineButton]} onPress={onLogin}>
            <Text style={[styles.buttonLabel, styles.outlineLabel]} accessibilityRole="button">
              {isLoggedIn ? 'Logout' : 'Login'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const pageDefaults = tokens.semantic.page.default as Record<string, number | string>;
  const primaryButton = tokens.semantic.button.primary as Record<string, number | string>;
  const secondaryButton = tokens.semantic.button.secondary as Record<string, number | string>;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: (pageDefaults.paddingHorizontal as number) ?? tokens.primitives.spacing.lg,
      paddingTop: (pageDefaults.paddingVertical as number) ?? tokens.primitives.spacing.lg,
      gap: tokens.primitives.spacing.md as number,
    },
    pageTitle: {},
    pageSubtitle: {},
    actions: {
      flexDirection: 'row',
      gap: tokens.primitives.spacing.sm as number,
      marginTop: tokens.primitives.spacing.sm as number,
    },
    button: {
      flex: 1,
      borderRadius: tokens.primitives.radius.md as number,
      paddingVertical: tokens.primitives.spacing.md as number,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: tokens.primitives.borderWidth.none as number,
    },
    primaryButton: {
      backgroundColor: primaryButton.backgroundDefault as string,
    },
    outlineButton: {
      borderWidth: secondaryButton.borderWidth as number,
      borderColor: secondaryButton.borderColor as string,
      backgroundColor: pageDefaults.backgroundColor as string,
    },
    buttonLabel: {},
    primaryLabel: {
      color: primaryButton.textColorDefault as string,
      fontSize: primaryButton.fontSize as number,
      fontWeight: primaryButton.fontWeight as any,
    },
    outlineLabel: {
      color: secondaryButton.borderColor as string,
      fontSize: secondaryButton.fontSize as number,
      fontWeight: secondaryButton.fontWeight as any,
    },
  });
}
