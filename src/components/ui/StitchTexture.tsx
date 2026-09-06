import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { color } from '@src/theme/theme';

type Props = {
  /** two palette tints to alternate */
  from?: string;
  to?: string;
  /** band thickness in px */
  band?: number;
  style?: ViewStyle;
};

// Stitch-textured placeholder standing in for a real progress photo. Palette
// tints, so an empty state still looks designed. Swap for a washed <Image> once
// real photos exist.
export default function StitchTexture({
  from = color.neutral[800],
  to = color.neutral[200],
  band = 9,
  style,
}: Props) {
  return (
    <View style={[styles.root, style]}>
      <View style={styles.fill}>
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={{ height: band, backgroundColor: i % 2 === 0 ? from : to }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFill },
});
