import React from 'react';
import { SecondaryScreen } from './SecondaryScreen';

type LoginScreenProps = {
  onBack: () => void;
};

export function LoginScreen({ onBack }: LoginScreenProps) {
  return <SecondaryScreen heading="Login Home" onBack={onBack} />;
}
