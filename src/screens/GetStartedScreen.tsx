import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View } from 'react-native';

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
  const primaryButton = tokens.semantic.button.primary;
  const secondaryButton = tokens.semantic.button.secondary;

  return StyleSheet.create({
    buttonStack: {
      alignSelf: 'stretch',
      gap: tokens.primitives.spacing.sm,
    },
    button: {
      alignSelf: 'flex-start',
      borderRadius: primaryButton.borderRadius,
      paddingVertical: primaryButton.paddingVertical,
      paddingHorizontal: primaryButton.paddingHorizontal,
    },
    buttonLabel: {
      fontWeight: `${primaryButton.fontWeight}` as TextStyle['fontWeight'],
      fontSize: primaryButton.fontSize,
    },
    primaryButton: {
      backgroundColor: primaryButton.backgroundDefault,
    },
    primaryLabel: {
      color: primaryButton.textColorDefault,
    },
    secondaryButton: {
      backgroundColor: secondaryButton.backgroundDefault,
    },
    secondaryLabel: {
      color: secondaryButton.textColorDefault,
    },
  });
}
