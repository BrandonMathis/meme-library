import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { loadThemeId, saveThemeId } from '@/lib/theme-storage';
import { THEMES, type ThemeId } from '@/lib/themes';

type ThemeContextType = {
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'default',
  setTheme: () => {},
  isLoading: true,
});

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemeId()
      .then((saved) => {
        if (saved && saved in THEMES) {
          setThemeId(saved);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    saveThemeId(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
