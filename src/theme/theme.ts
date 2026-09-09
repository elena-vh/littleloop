export const color = {
  bg: '#f5ead8',
  surface: '#ebddc5',
  text: '#201e1d',
  accent: '#c67139',
  accent2: '#7a8a5e',
  divider: 'rgba(32,30,29,0.16)',

  neutral: {
    100: '#f9f4ed',
    200: '#eee7db',
    300: '#dcd3c4',
    400: '#c0b6a5',
    500: '#a19786',
    600: '#82796a',
    700: '#645c50',
    800: '#474238',
    900: '#2e2b25',
  },
  acc: {
    100: '#fff2eb',
    200: '#ffe1d0',
    300: '#ffc6a5',
    400: '#f6a06b',
    500: '#d67f48',
    600: '#b2622d',
    700: '#8c491a',
    800: '#643312',
    900: '#402310',
  },
  acc2: {
    100: '#f0fae1',
    200: '#e1eecc',
    300: '#ccdbb2',
    400: '#aebf92',
    500: '#8fa073',
    600: '#728157',
    700: '#56633f',
    800: '#3d472b',
    900: '#272e1b',
  },
} as const;

export const font = {
  heading: 'Fraunces_700Bold',
  headingBlack: 'Fraunces_900Black',
  serif: 'Fraunces_400Regular',
  body: 'Figtree_400Regular',
  bodySemi: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
} as const;

export const type = {
  hero: {
    fontFamily: font.headingBlack,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontFamily: font.heading,
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.4,
  },
  pageTitle: { fontFamily: font.heading, fontSize: 26, lineHeight: 29 },
  sectionH: { fontFamily: font.heading, fontSize: 17, lineHeight: 20 },
  cardTitle: { fontFamily: font.heading, fontSize: 15, lineHeight: 18 },
  counterHuge: {
    fontFamily: font.headingBlack,
    fontSize: 78,
    lineHeight: 78,
    letterSpacing: -1,
  },
  statBig: { fontFamily: font.heading, fontSize: 28, lineHeight: 31 },
  body: { fontFamily: font.body, fontSize: 14, lineHeight: 21 },
  bodySm: { fontFamily: font.body, fontSize: 12.5, lineHeight: 18 },
  meta: {
    fontFamily: font.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: color.neutral[700],
  },
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.2,
    color: color.neutral[600],
  },
} as const;

export const space = {
  1: 4.4,
  2: 8.8,
  3: 13.2,
  4: 17.6,
  6: 26.4,
  8: 35.2,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  photo: 8,
  card: 16,
  cardLg: 20,
  pill: 999,
} as const;

export const shadow = {
  sm: {
    shadowColor: '#2e2b25',
    shadowOpacity: 0.14,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: '#2e2b25',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  lg: {
    shadowColor: '#2e2b25',
    shadowOpacity: 0.22,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
} as const;

export const HIT = 44;
