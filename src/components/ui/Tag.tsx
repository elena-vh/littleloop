import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { color, font, radius } from '@src/theme/theme';

type Variant = 'accent' | 'accent2' | 'neutral' | 'solid';

const BG: Record<Variant, string> = {
  accent: color.acc[100],
  accent2: color.acc2[100],
  neutral: color.neutral[100],
  solid: color.accent,
};
const FG: Record<Variant, string> = {
  accent: color.acc[800],
  accent2: color.acc2[800],
  neutral: color.neutral[800],
  solid: color.bg,
};

export default function Tag({
  label,
  variant = 'neutral',
  size = 10.5,
  style,
  textStyle,
}: {
  label: string;
  variant?: Variant;
  size?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        styles.tag,
        { backgroundColor: BG[variant], color: FG[variant], fontSize: size },
        style as any,
        textStyle as any,
      ]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  tag: {
    fontFamily: font.bodySemi,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    overflow: 'hidden',
  },
});
