import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
      style={[styles.safeArea, { backgroundColor: tokens.semantic.page.default.backgroundColor as string }]}
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
  const secondaryButton = tokens.semantic.button.secondary as Record<string, number | string>;

  return StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    secondaryContainer: {
      flex: 1,
      paddingHorizontal: tokens.semantic.page.default.paddingHorizontal as number,
      justifyContent: 'center',
      gap: tokens.primitives.spacing.md as number,
    },
    secondaryHeading: {},
    secondaryCopy: {},
    button: {
      alignSelf: 'flex-start',
      borderRadius: secondaryButton.borderRadius as number,
      paddingVertical: secondaryButton.paddingVertical as number,
      paddingHorizontal: secondaryButton.paddingHorizontal as number,
      borderWidth: secondaryButton.borderWidth as number,
      borderColor: secondaryButton.borderColor as string,
    },
    outlineButton: {
      backgroundColor: tokens.semantic.page.default.backgroundColor as string,
    },
    buttonLabel: {},
    outlineLabel: {
      color: secondaryButton.borderColor as string,
      fontSize: secondaryButton.fontSize as number,
      fontWeight: secondaryButton.fontWeight as any,
    },
  });
}
