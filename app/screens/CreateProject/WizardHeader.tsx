import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color, font, radius } from '@src/theme/theme';

export default function WizardHeader({
  step,
  title,
}: {
  step: 1 | 2 | 3;
  title: string;
}) {
  return (
    <View>
      <View style={styles.bar}>
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            style={[
              styles.seg,
              { backgroundColor: s <= step ? color.acc2[600] : color.neutral[300] },
            ]}
          />
        ))}
      </View>
      <Text style={styles.kicker}>Step {step} of 3</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 7, marginBottom: 22 },
  seg: { flex: 1, height: 7, borderRadius: radius.pill },
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 10.5,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 6,
  },
  title: {
    fontFamily: font.heading,
    fontSize: 28,
    lineHeight: 31,
    color: color.text,
    marginBottom: 22,
  },
});
