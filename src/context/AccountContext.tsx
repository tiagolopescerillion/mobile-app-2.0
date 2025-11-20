import React, { createContext, useContext, useMemo, useState } from 'react';

type AccountContextValue = {
  selectedAccountNumber: string | null;
  setSelectedAccountNumber: (accountNumber: string | null) => void;
};

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [selectedAccountNumber, setSelectedAccountNumber] = useState<string | null>(null);

  const value = useMemo(
    () => ({ selectedAccountNumber, setSelectedAccountNumber }),
    [selectedAccountNumber]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);

  if (!ctx) {
    throw new Error('useAccount must be used within AccountProvider');
  }

  return ctx;
}
