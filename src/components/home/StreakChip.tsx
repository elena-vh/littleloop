import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { color, font, radius, HIT } from '@src/theme/theme';

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
      <View style={styles.pill}>
        <Flame size={17} strokeWidth={2.75} color={color.acc[800]} />
        <Text style={styles.count}>{count}</Text>
      </View>
      <Text style={styles.label}>day streak</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: HIT,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: color.acc[100],
  },
  count: {
    fontFamily: font.bodyBold,
    fontSize: 13,
    color: color.acc[800],
  },
  label: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.neutral[700],
  },
});
