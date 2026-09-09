import React, { createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { color, radius, shadow } from './theme';

const theme = {
  name: 'light' as const,
  colors: {
    bg: color.bg,
    surface: color.surface,
    text: color.text,
    subtext: color.neutral[700],
    primary: color.accent,
    accent: color.accent,
    border: color.divider,
    tabBg: color.surface,
  },
  radius,
  shadow,
};

export type Theme = typeof theme;

type ThemeCtx = { theme: Theme; isDark: boolean };

const ThemeContext = createContext<ThemeCtx>({ theme, isDark: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme, isDark: false }}>
      <StatusBar style='dark' />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
