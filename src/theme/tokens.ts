// DEPRECATED compatibility shim.
// The source of truth is '@src/theme/theme'. These legacy names re-map onto the
// Organic tokens so screens keep compiling; migrate each importer to theme.ts
// during its restyle, then delete this file.
import { color, radius as r, shadow as sh, space } from './theme';

export const colors = {
  // roles
  bg: color.bg,
  surface: color.surface,
  text: color.text,
  subtext: color.neutral[700],
  primary: color.accent,
  accent: color.accent,
  border: color.divider,
  // legacy literal names — all remapped into the Organic palette
  white: color.surface,
  black: color.text,
  purple: color.accent,
  lavender: color.acc[100],
  terracotta: color.accent,
  beige: color.surface,
  gray100: color.neutral[100],
  gray300: color.neutral[300],
  gray600: color.neutral[600],
  gray900: color.neutral[900],
};

export const spacing = {
  xs: space[1],
  sm: space[2],
  md: space[3],
  lg: space[4],
  xl: space[6],
  '2xl': space[8],
};

export const radius = { sm: r.sm, md: r.md, lg: r.lg, xl: r.cardLg };

export const shadow = { sm: sh.sm, md: sh.md };
