import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { darkColors, lightColors, ThemeColors } from './colors';
import { selectThemeMode, ThemeMode } from '../store/settingsSlice';

type ResolvedScheme = 'light' | 'dark';

interface ThemeContextValue {
  colors: ThemeColors;
  themeMode: ThemeMode;
  resolvedScheme: ResolvedScheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useSelector(selectThemeMode);
  const systemScheme = useColorScheme();

  const resolvedScheme: ResolvedScheme =
    themeMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : themeMode;

  const colors = resolvedScheme === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, themeMode, resolvedScheme }),
    [colors, themeMode, resolvedScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
