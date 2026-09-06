// theme.ts — Organic design tokens for Little Loop
// Source of truth: Organic design system (styles.css). Do not hard-code values
// elsewhere; import from here so a retune propagates.

export const color = {
  bg: '#f5ead8', // app ground (cream)
  surface: '#ebddc5', // cards, inputs, tab-bar rows (sand)
  text: '#201e1d', // ink
  accent: '#c67139', // terracotta — primary actions
  accent2: '#7a8a5e', // sage — progress, time, "good"
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
  // terracotta ramp
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
  // sage ramp
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

// Fraunces (a "wonky" optical serif) for display; Figtree for body.
export const font = {
  heading: 'Fraunces_700Bold',
  headingBlack: 'Fraunces_900Black', // hero / oversized numerals
  serif: 'Fraunces_400Regular', // quieter serif for meta lines
  body: 'Figtree_400Regular',
  bodySemi: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
} as const;

// Real hierarchy, not a smooth ramp — the display sizes are meant to feel big.
export const type = {
  hero: { fontFamily: font.headingBlack, fontSize: 40, lineHeight: 42, letterSpacing: -0.5 },
  screenTitle: { fontFamily: font.heading, fontSize: 32, lineHeight: 35, letterSpacing: -0.4 },
  pageTitle: { fontFamily: font.heading, fontSize: 26, lineHeight: 29 },
  sectionH: { fontFamily: font.heading, fontSize: 17, lineHeight: 20 },
  cardTitle: { fontFamily: font.heading, fontSize: 15, lineHeight: 18 },
  counterHuge: { fontFamily: font.headingBlack, fontSize: 78, lineHeight: 78, letterSpacing: -1 },
  statBig: { fontFamily: font.heading, fontSize: 28, lineHeight: 31 },
  body: { fontFamily: font.body, fontSize: 14, lineHeight: 21 },
  bodySm: { fontFamily: font.body, fontSize: 12.5, lineHeight: 18 },
  meta: {
    fontFamily: font.body,
    fontSize: 11.5,
    lineHeight: 16,
    color: color.neutral[700],
  },
  // Quiet section label — sentence case, barely tracked. Not a shout.
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.2,
    color: color.neutral[600],
  },
} as const;

// 1.10x scale
export const space = {
  1: 4.4,
  2: 8.8,
  3: 13.2,
  4: 17.6,
  6: 26.4,
  8: 35.2,
} as const;

// Deliberate contrast: photos stay near-square, only controls go fully round.
export const radius = {
  sm: 6,
  md: 12,
  lg: 18,
  photo: 8, // images / textured blocks — crisp corners
  card: 16, // list cards / spec tiles
  cardLg: 20, // hero + status cards
  pill: 999,
} as const;

// Tuned to the cream ground — soft and ink-tinted, never grey/blue.
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

// Minimum tap target used throughout
export const HIT = 44;
