// utils/settingsManager.ts
export interface SettingsConfig {
  soundEnabled: boolean;
  showWPM: boolean;
  keyboardLayout: 'qwerty' | 'dvorak' | 'colemak';
  showKeyboard: boolean;
  smoothCaret: boolean;
  highlightErrors: boolean;
  autoSave: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DEFAULT_SETTINGS: SettingsConfig = {
  soundEnabled: true,
  showWPM: true,
  keyboardLayout: 'qwerty',
  showKeyboard: true,
  smoothCaret: true,
  highlightErrors: true,
  autoSave: true,
  difficulty: 'medium'
};

export function getSettings(): SettingsConfig {
  const stored = localStorage.getItem('typespeed_settings');
  return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
}


import { soundManager } from './soundManager'

export function updateSetting<K extends keyof SettingsConfig>(key: K, value: SettingsConfig[K]): void {
  const settings = getSettings();
  settings[key] = value;
  localStorage.setItem('typespeed_settings', JSON.stringify(settings));
  
  // Sync sound setting
  if (key === 'soundEnabled') {
    soundManager.setEnabled(value as boolean);
  }
}

export function resetSettings(): void {
  localStorage.setItem('typespeed_settings', JSON.stringify(DEFAULT_SETTINGS));
}

export function getFontSizeClass(size: string): string {
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl'
  };
  return sizes[size as keyof typeof sizes] || sizes.medium;
}

export function exportSettings(): string {
  return JSON.stringify(getSettings(), null, 2);
}

export function importSettings(settingsJson: string): boolean {
  try {
    const settings = JSON.parse(settingsJson);
    localStorage.setItem('typespeed_settings', JSON.stringify({ ...DEFAULT_SETTINGS, ...settings }));
    return true;
  } catch {
    return false;
  }
}
