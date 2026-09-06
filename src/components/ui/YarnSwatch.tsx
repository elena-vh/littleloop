import React from 'react';
import { View, StyleSheet } from 'react-native';
import { radius } from '@src/theme/theme';

// A yarn colour dot with two rings: a soft cream inset and a fine ink outline —
// so real yarn colours don't vanish against the sand cards.
export default function YarnSwatch({
  color: swatch,
  size = 46,
}: {
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.outer,
        { width: size, height: size, backgroundColor: swatch },
      ]}>
      <View style={[styles.inset, { borderRadius: size / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(32,30,29,0.22)',
  },
  inset: {
    ...StyleSheet.absoluteFill,
    borderWidth: 4,
    borderColor: 'rgba(245,234,216,0.35)',
  },
});
