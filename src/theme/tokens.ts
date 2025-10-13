export const colors = {
  lavender: '#E6E1F8',
  lilac: '#C7B8EA',
  purple: '#7C3AED',
  gray100: '#F5F5F5',
  gray300: '#D4D4D4',
  gray600: '#525252',
  gray900: '#171717',
  white: '#FFFFFF',
  black: '#000000',
  beige: '#D8C4B0',
};

export const spacing = {
  'xs': 4,
  'sm': 8,
  'md': 12,
  'lg': 16,
  'xl': 24,
  '2xl': 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};
export type ThemeName = 'light' | 'dark';

export const light = {
  name: 'light' as ThemeName,
  colors: {
    bg: 'linear-gradient(180deg, hsla(212, 46%, 66%, 1) 0%, hsla(0, 0%, 100%, 1) 1%)',
    surface: '#FFFFFF',
    text: '#171717',
    subtext: '#525252',
    primary: '#7C3AED', // purple
    accent: '#E6E1F8', // lavender
    border: '#E5E7EB',
    tabBg: 'transparent',
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 24 },
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },
  },
};

export const dark: typeof light = {
  ...light,
  name: 'dark',
  colors: {
    bg: '#0B0B0F',
    surface: '#14141C',
    text: '#F5F5F5',
    subtext: '#C7C7D1',
    primary: '#A78BFA',
    accent: '#2A2540',
    border: '#1F1F2A',
    tabBg: 'transparent',
  },
};
