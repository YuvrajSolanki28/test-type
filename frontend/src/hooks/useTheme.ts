import { useContext } from 'react';
import { ThemeContext } from '../contexts/themeTypes';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Return with renamed properties for convenience
  return {
    currentTheme: context.themeId,
    theme: context.theme,
    setTheme: context.setTheme,
    availableThemes: context.availableThemes,
  };
}
