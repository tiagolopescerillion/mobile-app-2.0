import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SecondaryScreen } from './SecondaryScreen';
import { useSharedWebview } from '../context/SharedWebviewProvider';
import { getWebviewConfiguration } from '../config/webviews';

type GetStartedScreenProps = {
  onBack: () => void;
};

const homeWebview = getWebviewConfiguration('selfServiceHome');
const browseWebview = getWebviewConfiguration('selfServiceBrowse');

export function GetStartedScreen({ onBack }: GetStartedScreenProps) {
  const { openWebview } = useSharedWebview();

  if (!homeWebview && !browseWebview) {
    return <SecondaryScreen heading="Get Started Home" onBack={onBack} />;
  }

  return (
    <SecondaryScreen heading="Get Started Home" onBack={onBack}>
      <View style={styles.buttonStack}>
        {homeWebview ? (
          <Pressable
            style={[buttonStyles.button, buttonStyles.primaryButton]}
            onPress={() => openWebview('selfServiceHome')}
          >
            <Text style={[buttonStyles.buttonLabel, buttonStyles.primaryLabel]}>{homeWebview.title}</Text>
          </Pressable>
        ) : null}

        {browseWebview ? (
          <Pressable
            style={[buttonStyles.button, buttonStyles.secondaryButton]}
            onPress={() => openWebview('selfServiceBrowse')}
          >
            <Text style={[buttonStyles.buttonLabel, buttonStyles.secondaryLabel]}>{browseWebview.title}</Text>
          </Pressable>
        ) : null}
      </View>
    </SecondaryScreen>
  );
}

const styles = StyleSheet.create({
  buttonStack: {
    alignSelf: 'stretch',
    gap: 12,
  },
});

const buttonStyles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  buttonLabel: {
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryLabel: {
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#0ea5e9',
  },
  secondaryLabel: {
    color: '#ffffff',
  },
});
