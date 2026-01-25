import { useState, useEffect, type ReactNode } from 'react';
import { type ThemeId, getCurrentTheme, setTheme as saveTheme, getTheme, themes } from '../utils/themeManager';
import { ThemeContext, type ThemeContextType } from './themeTypes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(getCurrentTheme());

  useEffect(() => {
    // Listen for theme changes from other tabs/windows
    const handleThemeChange = (e: CustomEvent<ThemeId>) => {
      setThemeId(e.detail);
    };

    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themechange', handleThemeChange as EventListener);
  }, []);

  const handleSetTheme = (newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    saveTheme(newThemeId);
  };

  const value: ThemeContextType = {
    themeId,
    theme: getTheme(themeId),
    setTheme: handleSetTheme,
    availableThemes: Object.values(themes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
