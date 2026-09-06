import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { color, font, radius } from '@src/theme/theme';

export default function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export const fieldStyles = StyleSheet.create({
  input: {
    fontFamily: font.body,
    fontSize: 16,
    color: color.text,
    paddingVertical: 4,
  },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  label: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 10,
  },
});
