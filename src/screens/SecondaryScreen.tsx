import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDesignSystem } from '../theme/DesignSystemProvider';

type SecondaryScreenProps = {
  heading: string;
  onBack: () => void;
  children?: React.ReactNode;
};

export function SecondaryScreen({ heading, onBack, children }: SecondaryScreenProps) {
  const { tokens } = useDesignSystem();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: tokens.semantic.page.default.backgroundColor }]}
      edges={['top', 'right', 'bottom', 'left']}
    >
      <View style={styles.secondaryContainer}>
        <Text style={[styles.secondaryHeading, tokens.semantic.text.title]}>{heading}</Text>
        <Text style={[styles.secondaryCopy, tokens.semantic.text.description]}>
          This screen is ready for your future content.
        </Text>
        {children}
        <Pressable style={[styles.button, styles.outlineButton]} onPress={onBack}>
          <Text style={[styles.buttonLabel, styles.outlineLabel]}>Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const secondaryButton = tokens.semantic.button.secondary;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    secondaryContainer: {
      flex: 1,
      paddingHorizontal: tokens.semantic.page.default.paddingHorizontal,
      justifyContent: 'center',
      gap: tokens.primitives.spacing.md,
    },
    secondaryHeading: {},
    secondaryCopy: {},
    button: {
      alignSelf: 'flex-start',
      borderRadius: secondaryButton.borderRadius,
      paddingVertical: secondaryButton.paddingVertical,
      paddingHorizontal: secondaryButton.paddingHorizontal,
      borderWidth: secondaryButton.borderWidth,
      borderColor: secondaryButton.borderColor,
    },
    outlineButton: {
      backgroundColor: tokens.semantic.page.default.backgroundColor,
    },
    buttonLabel: {},
    outlineLabel: {
      color: secondaryButton.borderColor,
      fontSize: secondaryButton.fontSize,
      fontWeight: `${secondaryButton.fontWeight}` as TextStyle['fontWeight'],
    },
  });
}
