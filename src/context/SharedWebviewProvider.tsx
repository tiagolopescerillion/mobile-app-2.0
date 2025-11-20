import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WebViewOverlay } from '../components/WebViewOverlay';
import { getWebviewConfiguration } from '../config/webviews';

export type SharedWebviewContextValue = {
  openWebview: (configKey: string) => void;
  closeWebview: () => void;
};

const SharedWebviewContext = createContext<SharedWebviewContextValue | undefined>(undefined);

const SELF_SERVICE_BASE_KEY = 'selfServiceBase';

export function SharedWebviewProvider({ children }: { children: React.ReactNode }) {
  const [currentConfigKey, setCurrentConfigKey] = useState<string | null>(SELF_SERVICE_BASE_KEY);
  const [isVisible, setIsVisible] = useState(false);

  const currentConfig = useMemo(
    () => (currentConfigKey ? getWebviewConfiguration(currentConfigKey) : null),
    [currentConfigKey]
  );

  useEffect(() => {
    if (currentConfigKey !== SELF_SERVICE_BASE_KEY) {
      return;
    }

    const baseConfig = getWebviewConfiguration(SELF_SERVICE_BASE_KEY);
    if (!baseConfig) {
      setCurrentConfigKey(null);
    }
  }, [currentConfigKey]);

  const openWebview = useCallback((configKey: string) => {
    const config = getWebviewConfiguration(configKey);

    if (!config) {
      return;
    }

    setCurrentConfigKey(configKey);
    setIsVisible(true);
  }, []);

  const closeWebview = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <SharedWebviewContext.Provider value={{ openWebview, closeWebview }}>
      {children}
      {currentConfig ? (
        <WebViewOverlay
          visible={isVisible}
          keepMounted
          url={currentConfig.url}
          title={currentConfig.title}
          onClose={closeWebview}
        />
      ) : null}
    </SharedWebviewContext.Provider>
  );
}

export function useSharedWebview(): SharedWebviewContextValue {
  const ctx = useContext(SharedWebviewContext);

  if (!ctx) {
    throw new Error('useSharedWebview must be used within SharedWebviewProvider');
  }

  return ctx;
}
