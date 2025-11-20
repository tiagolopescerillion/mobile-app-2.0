import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';
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
  const pageTokens = tokens.semantic.page.default;

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
  const pageDefaults = tokens.semantic.page.default;
  const primaryButton = tokens.semantic.button.primary;
  const secondaryButton = tokens.semantic.button.secondary;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: pageDefaults.paddingHorizontal ?? tokens.primitives.spacing.lg,
      paddingTop: pageDefaults.paddingVertical ?? tokens.primitives.spacing.lg,
      gap: tokens.primitives.spacing.md,
    },
    pageTitle: {},
    pageSubtitle: {},
    actions: {
      flexDirection: 'row',
      gap: tokens.primitives.spacing.sm,
      marginTop: tokens.primitives.spacing.sm,
    },
    button: {
      flex: 1,
      borderRadius: tokens.primitives.radius.md,
      paddingVertical: tokens.primitives.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: tokens.primitives.borderWidth.none,
    },
    primaryButton: {
      backgroundColor: primaryButton.backgroundDefault,
    },
    outlineButton: {
      borderWidth: secondaryButton.borderWidth,
      borderColor: secondaryButton.borderColor,
      backgroundColor: pageDefaults.backgroundColor,
    },
    buttonLabel: {},
    primaryLabel: {
      color: primaryButton.textColorDefault,
      fontSize: primaryButton.fontSize,
      fontWeight: `${primaryButton.fontWeight}` as TextStyle['fontWeight'],
    },
    outlineLabel: {
      color: secondaryButton.borderColor,
      fontSize: secondaryButton.fontSize,
      fontWeight: `${secondaryButton.fontWeight}` as TextStyle['fontWeight'],
    },
  });
}
