// Theme configuration for TypeSpeed
export type ThemeId = 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunset' | 'nord' | 'dracula';

export interface Theme {
  id: ThemeId;
  name: string;
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textMuted: string;
    primary: string;
    primaryGradient: string;
    accent: string;
    error: string;
    success: string;
    border: string;
    card: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark (Default)',
    colors: {
      bg: 'from-[#0a0a0f] via-[#0f0f1a] to-[#1a0f1f]',
      bgSecondary: 'bg-gray-800/50',
      text: 'text-white',
      textMuted: 'text-white/60',
      primary: 'blue-500',
      primaryGradient: 'from-blue-500 to-purple-600',
      accent: 'purple-500',
      error: 'red-500',
      success: 'green-500',
      border: 'border-white/10',
      card: 'bg-white/5',
    },
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Blue',
    colors: {
      bg: 'from-[#0d1117] via-[#161b22] to-[#21262d]',
      bgSecondary: 'bg-[#21262d]',
      text: 'text-[#c9d1d9]',
      textMuted: 'text-[#8b949e]',
      primary: 'sky-500',
      primaryGradient: 'from-sky-400 to-blue-600',
      accent: 'blue-400',
      error: 'red-400',
      success: 'emerald-400',
      border: 'border-[#30363d]',
      card: 'bg-[#161b22]',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: {
      bg: 'from-[#0c1821] via-[#162028] to-[#1b3a4b]',
      bgSecondary: 'bg-[#1b3a4b]/50',
      text: 'text-[#a9d6e5]',
      textMuted: 'text-[#61a5c2]',
      primary: 'cyan-400',
      primaryGradient: 'from-cyan-400 to-teal-500',
      accent: 'teal-400',
      error: 'rose-400',
      success: 'emerald-400',
      border: 'border-[#2c5364]/50',
      card: 'bg-[#1b3a4b]/30',
    },
  },
  forest: {
    id: 'forest',
    name: 'Forest Night',
    colors: {
      bg: 'from-[#0d1f0d] via-[#1a2f1a] to-[#0f2417]',
      bgSecondary: 'bg-[#1a2f1a]/50',
      text: 'text-[#b8e0b8]',
      textMuted: 'text-[#6b9b6b]',
      primary: 'emerald-400',
      primaryGradient: 'from-emerald-400 to-green-600',
      accent: 'lime-400',
      error: 'orange-400',
      success: 'green-400',
      border: 'border-[#2d4f2d]/50',
      card: 'bg-[#1a2f1a]/30',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: {
      bg: 'from-[#1a0a0a] via-[#2d1515] to-[#1a0f0a]',
      bgSecondary: 'bg-[#2d1515]/50',
      text: 'text-[#ffd6cc]',
      textMuted: 'text-[#cc9999]',
      primary: 'orange-400',
      primaryGradient: 'from-orange-400 to-rose-500',
      accent: 'amber-400',
      error: 'red-400',
      success: 'emerald-400',
      border: 'border-[#4a2020]/50',
      card: 'bg-[#2d1515]/30',
    },
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    colors: {
      bg: 'from-[#2e3440] via-[#3b4252] to-[#434c5e]',
      bgSecondary: 'bg-[#3b4252]',
      text: 'text-[#eceff4]',
      textMuted: 'text-[#d8dee9]',
      primary: 'sky-400',
      primaryGradient: 'from-[#88c0d0] to-[#81a1c1]',
      accent: 'sky-300',
      error: 'rose-400',
      success: 'emerald-400',
      border: 'border-[#4c566a]',
      card: 'bg-[#3b4252]/50',
    },
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    colors: {
      bg: 'from-[#282a36] via-[#1e1f29] to-[#282a36]',
      bgSecondary: 'bg-[#44475a]',
      text: 'text-[#f8f8f2]',
      textMuted: 'text-[#6272a4]',
      primary: 'purple-400',
      primaryGradient: 'from-[#bd93f9] to-[#ff79c6]',
      accent: 'pink-400',
      error: 'red-400',
      success: 'green-400',
      border: 'border-[#44475a]',
      card: 'bg-[#44475a]/50',
    },
  },
};

const THEME_STORAGE_KEY = 'typespeed_theme';

export function getCurrentTheme(): ThemeId {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return (stored as ThemeId) || 'dark';
}

export function setTheme(themeId: ThemeId): void {
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
  // Dispatch event so components can update
  window.dispatchEvent(new CustomEvent('themechange', { detail: themeId }));
}

export function getTheme(themeId: ThemeId): Theme {
  return themes[themeId] || themes.dark;
}
