// DEPRECATED compatibility shim — see tokens.ts.
// Source of truth: '@src/theme/theme' `type`.
import { type } from './theme';

export const typography = {
  heading: type.sectionH, // Caprasimo 18
  subheading: type.cardTitle, // Caprasimo 15
  body: type.body, // Figtree 14.5
  caption: type.bodySm, // Figtree 12.5
};
