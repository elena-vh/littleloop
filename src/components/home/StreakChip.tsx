import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { color, font, HIT } from '@src/theme/theme';

export default function StreakChip({
  count,
  onPress,
}: {
  count: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={styles.row}
      accessibilityRole='button'
      accessibilityLabel={`${count} day streak`}>
      <Flame size={18} strokeWidth={2.75} color={color.accent} />
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>day streak</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    minHeight: HIT,
  },
  count: {
    fontFamily: font.headingBlack,
    fontSize: 19,
    color: color.accent,
    marginRight: 1,
  },
  label: {
    fontFamily: font.serif,
    fontSize: 13,
    color: color.neutral[700],
  },
});
