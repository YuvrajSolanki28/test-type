import { createContext } from 'react';
import type { Theme, ThemeId } from '../utils/themeManager';

export interface ThemeContextType {
  themeId: ThemeId;
  theme: Theme;
  setTheme: (themeId: ThemeId) => void;
  availableThemes: Theme[];
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
