import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { loadDeleteAfterSave, saveDeleteAfterSave } from '@/lib/settings-storage';

type SettingsContextType = {
  deleteAfterSave: boolean;
  setDeleteAfterSave: (enabled: boolean) => void;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType>({
  deleteAfterSave: false,
  setDeleteAfterSave: () => {},
  isLoading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [deleteAfterSave, setDeleteAfterSaveState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeleteAfterSave()
      .then(setDeleteAfterSaveState)
      .finally(() => setIsLoading(false));
  }, []);

  const setDeleteAfterSave = useCallback((enabled: boolean) => {
    setDeleteAfterSaveState(enabled);
    saveDeleteAfterSave(enabled);
  }, []);

  return (
    <SettingsContext.Provider value={{ deleteAfterSave, setDeleteAfterSave, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
