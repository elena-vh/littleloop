// theme.ts — Organic design tokens for Little Loop
// Source of truth: Organic design system (styles.css). Do not hard-code values
// elsewhere; import from here so a retune propagates.

export const color = {
  bg: '#f5ead8',        // app ground (cream)
  surface: '#ebddc5',   // cards, inputs, tab-bar rows (sand)
  text: '#201e1d',      // ink
  accent: '#c67139',    // terracotta — primary actions
  accent2: '#7a8a5e',   // sage — progress, time, "good"
  divider: 'rgba(32,30,29,0.16)',

  neutral: {
    100: '#f9f4ed', 200: '#eee7db', 300: '#dcd3c4', 400: '#c0b6a5',
    500: '#a19786', 600: '#82796a', 700: '#645c50', 800: '#474238', 900: '#2e2b25',
  },
  // terracotta ramp
  acc: {
    100: '#fff2eb', 200: '#ffe1d0', 300: '#ffc6a5', 400: '#f6a06b',
    500: '#d67f48', 600: '#b2622d', 700: '#8c491a', 800: '#643312', 900: '#402310',
  },
  // sage ramp
  acc2: {
    100: '#f0fae1', 200: '#e1eecc', 300: '#ccdbb2', 400: '#aebf92',
    500: '#8fa073', 600: '#728157', 700: '#56633f', 800: '#3d472b', 900: '#272e1b',
  },
} as const;

// Figtree 400/600/700 for everything; Caprasimo 400 for display only.
export const font = {
  heading: 'Caprasimo_400Regular',
  body: 'Figtree_400Regular',
  bodySemi: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
} as const;

// Heading sizes as used in the screens (lineHeight = size * 1.12, letterSpacing -1.5%)
export const type = {
  screenTitle: { fontFamily: font.heading, fontSize: 30, lineHeight: 34 },
  pageTitle:   { fontFamily: font.heading, fontSize: 28, lineHeight: 31 },
  sectionH:    { fontFamily: font.heading, fontSize: 18, lineHeight: 21 },
  cardTitle:   { fontFamily: font.heading, fontSize: 15, lineHeight: 18 },
  counterHuge: { fontFamily: font.heading, fontSize: 76, lineHeight: 76 },
  statBig:     { fontFamily: font.heading, fontSize: 30, lineHeight: 34 },
  body:        { fontFamily: font.body, fontSize: 14.5, lineHeight: 22 },
  bodySm:      { fontFamily: font.body, fontSize: 12.5, lineHeight: 19 },
  meta:        { fontFamily: font.body, fontSize: 11.5, lineHeight: 17, color: color.neutral[700] },
  // Uppercase kickers: terracotta-700 on sand, tracked out
  kicker:      { fontFamily: font.bodySemi, fontSize: 10, letterSpacing: 1.1,
                 textTransform: 'uppercase' as const, color: color.acc[700] },
} as const;

// 1.10x scale
export const space = { 1: 4.4, 2: 8.8, 3: 13.2, 4: 17.6, 6: 26.4, 8: 35.2 } as const;

export const radius = {
  sm: 8, md: 16, lg: 28,
  card: 26,      // list cards / spec tiles
  cardLg: 34,    // hero + status cards
  pill: 999,
} as const;

// Tuned to the cream ground — soft and ink-tinted, never grey/blue.
export const shadow = {
  sm: { shadowColor: '#2e2b25', shadowOpacity: 0.14, shadowRadius: 2,  shadowOffset: { width: 0, height: 1 },  elevation: 1 },
  md: { shadowColor: '#2e2b25', shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },  elevation: 4 },
  lg: { shadowColor: '#2e2b25', shadowOpacity: 0.22, shadowRadius: 32, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
} as const;

// Minimum tap target used throughout
export const HIT = 44;
