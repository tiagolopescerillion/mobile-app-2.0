import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WebViewOverlay } from '../components/WebViewOverlay';
import { getWebviewConfiguration } from '../config/webviews';
import { logWebview } from '../utils/webviewLogger';
import { useAccount } from './AccountContext';

export type SharedWebviewContextValue = {
  openWebview: (configKey: string) => void;
  closeWebview: () => void;
};

const SharedWebviewContext = createContext<SharedWebviewContextValue | undefined>(undefined);

const SELF_SERVICE_BASE_KEY = 'selfServiceBase';

export function SharedWebviewProvider({ children }: { children: React.ReactNode }) {
  const [currentConfigKey, setCurrentConfigKey] = useState<string | null>(SELF_SERVICE_BASE_KEY);
  const [isVisible, setIsVisible] = useState(false);
  const { selectedAccountNumber } = useAccount();

  const currentConfig = useMemo(
    () =>
      currentConfigKey
        ? getWebviewConfiguration(currentConfigKey, {
            accountNumber: selectedAccountNumber,
          })
        : null,
    [currentConfigKey, selectedAccountNumber]
  );

  useEffect(() => {
    if (currentConfigKey !== SELF_SERVICE_BASE_KEY) {
      return;
    }

    const baseConfig = getWebviewConfiguration(SELF_SERVICE_BASE_KEY, {
      accountNumber: selectedAccountNumber,
    });
    if (!baseConfig) {
      setCurrentConfigKey(null);
      logWebview('warmup_skipped', { reason: 'Missing self-service base configuration' });
      return;
    }

    logWebview('warmup_initiated', { url: baseConfig.url, title: baseConfig.title });
  }, [currentConfigKey, selectedAccountNumber]);

  const openWebview = useCallback(
    (configKey: string) => {
      const config = getWebviewConfiguration(configKey, {
        accountNumber: selectedAccountNumber,
      });

      if (!config) {
        logWebview('open_failed', {
          reason: 'Configuration not found or missing dynamic value(s)',
          configKey,
          accountNumber: selectedAccountNumber ?? 'none',
        });
        return;
      }

      setCurrentConfigKey(configKey);
      setIsVisible(true);
      logWebview('open_requested', { configKey, url: config.url, title: config.title });
    },
    [selectedAccountNumber]
  );

  const closeWebview = useCallback(() => {
    setIsVisible(false);
    logWebview('close_requested', { configKey: currentConfigKey ?? 'unknown' });
  }, [currentConfigKey]);

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
