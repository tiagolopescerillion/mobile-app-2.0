import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SecondaryScreen } from './SecondaryScreen';
import { useSharedWebview } from '../context/SharedWebviewProvider';
import { getWebviewConfiguration } from '../config/webviews';
import { useDesignSystem } from '../theme/DesignSystemProvider';

type GetStartedScreenProps = {
  onBack: () => void;
};

const homeWebview = getWebviewConfiguration('selfServiceHome');
const browseWebview = getWebviewConfiguration('selfServiceBrowse');

export function GetStartedScreen({ onBack }: GetStartedScreenProps) {
  const { tokens } = useDesignSystem();
  const { openWebview } = useSharedWebview();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  if (!homeWebview && !browseWebview) {
    return <SecondaryScreen heading="Get Started Home" onBack={onBack} />;
  }

  return (
    <SecondaryScreen heading="Get Started Home" onBack={onBack}>
      <View style={styles.buttonStack}>
        {homeWebview ? (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={() => openWebview('selfServiceHome')}
          >
            <Text style={[styles.buttonLabel, styles.primaryLabel]}>{homeWebview.title}</Text>
          </Pressable>
        ) : null}

        {browseWebview ? (
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={() => openWebview('selfServiceBrowse')}
          >
            <Text style={[styles.buttonLabel, styles.secondaryLabel]}>{browseWebview.title}</Text>
          </Pressable>
        ) : null}
      </View>
    </SecondaryScreen>
  );
}

function createStyles(tokens: ReturnType<typeof useDesignSystem>['tokens']) {
  const primaryButton = tokens.semantic.button.primary as Record<string, number | string>;
  const secondaryButton = tokens.semantic.button.secondary as Record<string, number | string>;

  return StyleSheet.create({
    buttonStack: {
      alignSelf: 'stretch',
      gap: tokens.primitives.spacing.sm as number,
    },
    button: {
      alignSelf: 'flex-start',
      borderRadius: primaryButton.borderRadius as number,
      paddingVertical: primaryButton.paddingVertical as number,
      paddingHorizontal: primaryButton.paddingHorizontal as number,
    },
    buttonLabel: {
      fontWeight: primaryButton.fontWeight as any,
      fontSize: primaryButton.fontSize as number,
    },
    primaryButton: {
      backgroundColor: primaryButton.backgroundDefault as string,
    },
    primaryLabel: {
      color: primaryButton.textColorDefault as string,
    },
    secondaryButton: {
      backgroundColor: secondaryButton.backgroundDefault as string,
    },
    secondaryLabel: {
      color: secondaryButton.textColorDefault as string,
    },
  });
}
