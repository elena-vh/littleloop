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
  const pctLabel = `${Math.round(pct * 100)}%`;

  const sub = primary
    ? `Body · row ${primary.current} of ${primary.total}`
    : 'Not started yet';

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Pick up where you left off</Text>

      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.title} numberOfLines={2}>
            {project.name}
          </Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>

        <ProgressRing progress={pct} size={74} stroke={8}>
          <Text style={styles.ringLabel}>{pctLabel}</Text>
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
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: color.acc2[800],
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  left: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: font.heading,
    fontSize: 22,
    lineHeight: 25,
    color: color.text,
    marginBottom: 6,
  },
  sub: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.acc2[900],
  },
  ringLabel: {
    fontFamily: font.heading,
    fontSize: 15,
    color: color.acc2[900],
  },
  button: {
    marginTop: 16,
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
