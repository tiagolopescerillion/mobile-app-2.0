import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SecondaryScreen } from './SecondaryScreen';
import { WebViewOverlay } from '../components/WebViewOverlay';
import { getWebviewConfiguration } from '../config/webviews';

type GetStartedScreenProps = {
  onBack: () => void;
};

const ecommerceWebview = getWebviewConfiguration('ecommerce');

export function GetStartedScreen({ onBack }: GetStartedScreenProps) {
  const [isWebviewOpen, setIsWebviewOpen] = useState(false);

  if (!ecommerceWebview) {
    return <SecondaryScreen heading="Get Started Home" onBack={onBack} />;
  }

  return (
    <SecondaryScreen heading="Get Started Home" onBack={onBack}>
      <Pressable
        style={[buttonStyles.button, buttonStyles.primaryButton]}
        onPress={() => setIsWebviewOpen(true)}
      >
        <Text style={[buttonStyles.buttonLabel, buttonStyles.primaryLabel]}>{ecommerceWebview.title}</Text>
      </Pressable>

      <WebViewOverlay
        visible={isWebviewOpen}
        onClose={() => setIsWebviewOpen(false)}
        url={ecommerceWebview.url}
        title={ecommerceWebview.title}
      />
    </SecondaryScreen>
  );
}

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
});
