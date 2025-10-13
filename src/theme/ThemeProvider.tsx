import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark, ThemeName } from './tokens';
import { StatusBar } from 'expo-status-bar';

type Mode = 'system' | ThemeName;

type ThemeCtx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  theme: typeof light;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeCtx | null>(null);
const STORAGE_KEY = 'littleloop-theme-mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // load saved mode
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'light' || v === 'dark' || v === 'system') setModeState(v);
    });
  }, []);

  // watch OS changes when in system mode
  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(colorScheme)
    );
    return () => sub.remove();
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    AsyncStorage.setItem(STORAGE_KEY, m).catch(() => {});
  };

  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return systemScheme === 'dark';
  }, [mode, systemScheme]);

  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ mode, setMode, theme, isDark }}>
      {/* Keep StatusBar readable */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
