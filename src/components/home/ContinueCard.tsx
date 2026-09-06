import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, font, radius } from '@src/theme/theme';
import ProgressRing from '@src/components/ui/ProgressRing';
import type { Project } from '@src/db/projectsRepo';
import { useProgress, PRIMARY_COUNTER, projectPercent } from '@src/store/progress';

export default function ContinueCard({
  project,
  onPress,
}: {
  project: Project;
  onPress: () => void;
}) {
  const counters = useProgress((s) => s.counters);
  const primary = counters[project.id]?.[PRIMARY_COUNTER];
  const pct = projectPercent(counters, project.id);

  const sub = primary
    ? `Row ${primary.current} of ${primary.total}`
    : 'Not started yet';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title} numberOfLines={2}>
            {project.name}
          </Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>

        <ProgressRing progress={pct} size={82} stroke={8}>
          <Text style={styles.ringLabel}>{Math.round(pct * 100)}</Text>
        </ProgressRing>
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole='button'>
        <Text style={styles.buttonLabel}>Continue knitting</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.acc2[200],
    borderRadius: radius.cardLg,
    padding: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  left: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: font.heading,
    fontSize: 25,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: color.text,
    marginBottom: 6,
  },
  sub: {
    fontFamily: font.serif,
    fontSize: 14,
    color: color.acc2[900],
  },
  ringLabel: {
    fontFamily: font.headingBlack,
    fontSize: 20,
    color: color.acc2[900],
  },
  button: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { backgroundColor: color.acc[600] },
  buttonLabel: {
    fontFamily: font.bodySemi,
    fontSize: 15,
    color: color.bg,
  },
});
