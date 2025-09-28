import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { themeService, Theme } from '../services/themeService';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, _setTheme] = useState<Theme>(themeService.getTheme());

  useEffect(() => {
    themeService.applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    themeService.saveTheme(newTheme);
    _setTheme(newTheme);
  }, []);
  
  const resetTheme = useCallback(() => {
      const defaultTheme = themeService.resetTheme();
      _setTheme(defaultTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme, resetTheme }), [theme, setTheme, resetTheme]);

  // FIX: Replaced JSX with React.createElement to resolve compilation errors in a .ts file.
  return React.createElement(ThemeContext.Provider, { value }, children);
};