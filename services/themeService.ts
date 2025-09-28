import { LOCAL_STORAGE_KEYS } from '../constants';

export interface Theme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  textStrong: string;
  textMuted: string;
  bgGradientFrom: string;
  bgGradientTo: string;
}

const defaultTheme: Theme = {
  primary: '#0ea5e9', // sky-500
  primaryDark: '#0284c7', // sky-600
  primaryLight: '#7dd3fc', // sky-300
  textStrong: '#1e3a8a', // sky-800
  textMuted: '#0369a1', // sky-700
  bgGradientFrom: '#e0f2fe', // sky-100
  bgGradientTo: '#bfdbfe', // blue-200
};

class ThemeService {
  getTheme(): Theme {
    const themeStr = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    if (themeStr) {
      try {
        const savedTheme = JSON.parse(themeStr);
        if (Object.keys(defaultTheme).every(key => key in savedTheme)) {
            return savedTheme;
        }
      } catch (e) {
        console.error("Failed to parse theme from localStorage", e);
      }
    }
    return defaultTheme;
  }

  saveTheme(theme: Theme): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, JSON.stringify(theme));
  }
  
  resetTheme(): Theme {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.THEME);
      this.applyTheme(defaultTheme);
      return defaultTheme;
  }

  applyTheme(theme: Theme): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-dark', theme.primaryDark);
    root.style.setProperty('--color-primary-light', theme.primaryLight);
    root.style.setProperty('--color-text-strong', theme.textStrong);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-bg-gradient-from', theme.bgGradientFrom);
    root.style.setProperty('--color-bg-gradient-to', theme.bgGradientTo);
  }
}

export const themeService = new ThemeService();
