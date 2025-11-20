import React, { createContext, useContext, useMemo, useState } from 'react';

import designSystemConfig from '../../CONFIGURATIONS/design-system.json';

// We intentionally type tokens loosely (as "any") so component code can access
// nested keys like `tokens.primitives.spacing.sm` without TypeScript errors.
// The JSON-driven design-system schema is dynamic and not expressed as a
// compile-time type, so a permissive shape keeps the IDE happy while still
// providing runtime safety through the resolver.
type TokenValue = any;
type TokenRecord = { [key: string]: TokenValue };

type Mode = 'light' | 'dark';

type DesignSystemContextValue = {
  mode: Mode;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
  tokens: {
    primitives: TokenRecord;
    semantic: TokenRecord;
  };
};

const DesignSystemContext = createContext<DesignSystemContextValue | undefined>(
  undefined
);

function getValueFromPath(scope: TokenRecord, path: string): TokenValue {
  return path.split('.').reduce<TokenValue>((value, key) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return (value as TokenRecord)[key];
    }
    return undefined as unknown as TokenValue;
  }, scope);
}

function resolveObjectWithScope<T extends TokenValue>(
  value: T,
  scope: TokenRecord
): T {
  const resolveValue = (current: TokenValue): TokenValue => {
    if (typeof current === 'string' && current.startsWith('$')) {
      const referenced = getValueFromPath(scope, current.slice(1));
      return resolveValue(referenced);
    }

    if (Array.isArray(current)) {
      return current.map((item) => resolveValue(item)) as TokenValue;
    }

    if (current && typeof current === 'object') {
      return Object.fromEntries(
        Object.entries(current).map(([key, nested]) => [key, resolveValue(nested)])
      ) as TokenValue;
    }

    return current;
  };

  return resolveValue(value) as T;
}

function resolvePrimitives(mode: Mode): TokenRecord {
  const modePrimitives = designSystemConfig.primitives[mode];
  return resolveObjectWithScope(modePrimitives, modePrimitives) as TokenRecord;
}

function resolveSemantic(primitives: TokenRecord): TokenRecord {
  const combinedScope = { ...primitives, ...designSystemConfig.semantic } as TokenRecord;
  return resolveObjectWithScope(
    designSystemConfig.semantic as TokenRecord,
    combinedScope
  ) as TokenRecord;
}

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>((designSystemConfig.currentMode as Mode) ?? 'light');

  const primitives = useMemo(() => resolvePrimitives(mode), [mode]);
  const semantic = useMemo(() => resolveSemantic(primitives), [primitives]);

  const value: DesignSystemContextValue = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((previous) => (previous === 'light' ? 'dark' : 'light')),
      tokens: { primitives, semantic },
    }),
    [mode, primitives, semantic]
  );

  return <DesignSystemContext.Provider value={value}>{children}</DesignSystemContext.Provider>;
}

export function useDesignSystem(): DesignSystemContextValue {
  const context = useContext(DesignSystemContext);

  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }

  return context;
}
