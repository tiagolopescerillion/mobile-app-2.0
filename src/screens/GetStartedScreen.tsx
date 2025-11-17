import React from 'react';
import { SecondaryScreen } from './SecondaryScreen';

type GetStartedScreenProps = {
  onBack: () => void;
};

export function GetStartedScreen({ onBack }: GetStartedScreenProps) {
  return <SecondaryScreen heading="Get Started Home" onBack={onBack} />;
}
