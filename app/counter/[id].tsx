import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  ChevronLeft,
  Timer,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { randomUUID } from 'expo-crypto';

import { color, font, radius, shadow, HIT } from '@src/theme/theme';
import ProgressRing from '@src/components/ui/ProgressRing';
import { getProjectById, type Project } from '@src/db/projectsRepo';
import { startSession, finishSession } from '@src/db/sessionsRepo';
import { useProgress } from '@src/store/progress';
import {
  REPEAT_LEN,
  instructionFor,
  stitchCountFor,
  repeatInfo,
} from '@src/lib/pattern';

const DEFAULT_TOTAL: Record<string, number> = { body: 250, sleeve: 60 };
const UNIT: Record<string, string> = { body: 'rows', sleeve: 'rounds' };

function fmtClock(total: number) {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${p(m)}:${p(ss)}` : `${p(m)}:${p(ss)}`;
}

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string; counter?: string }>();
  const projectId = params.id;
  const counterName = params.counter === 'sleeve' ? 'sleeve' : 'body';

  const [project, setProject] = useState<Project | null>(null);
  useFocusEffect(
    React.useCallback(() => {
      let alive = true;
      getProjectById(projectId).then((p) => alive && setProject(p));
      return () => {
        alive = false;
      };
    }, [projectId])
  );

  const getCounter = useProgress((s) => s.getCounter);
  const setCounter = useProgress((s) => s.setCounter);
  const bump = useProgress((s) => s.bump);
  const reset = useProgress((s) => s.reset);
  const stored = useProgress((s) => s.counters[projectId]?.[counterName]);

  const total = stored?.total || DEFAULT_TOTAL[counterName];
  const row = stored?.current ?? 0;
  const unit = UNIT[counterName];

  useEffect(() => {
    if (!stored || stored.total <= 0) {
      setCounter(projectId, counterName, {
        current: stored?.current ?? 0,
        total,
      });
    }
  }, [projectId, counterName]);

  const pct = total > 0 ? Math.min(1, row / total) : 0;
  const { repeatsTotal, repeatIdx, withinRepeat } = repeatInfo(row, total);
  const repeatPct = withinRepeat ? withinRepeat / REPEAT_LEN : 0;
  const instruction = instructionFor(row);
  const stitchCount = stitchCountFor(row);

  const inc = () => bump(projectId, counterName, 1);
  const dec = () => bump(projectId, counterName, -1);

  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const sessionRef = useRef<{ id: string; startedAt: number } | null>(null);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSession = React.useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
    const s = sessionRef.current;
    if (s) {
      const dur = Math.round((Date.now() - s.startedAt) / 1000);
      if (dur > 0) finishSession({ id: s.id, durationSeconds: dur });
      sessionRef.current = null;
    }
  }, []);

  const toggleTimer = () => {
    if (running) {
      stopSession();
      setRunning(false);
    } else {
      const id = randomUUID();
      const startedAt = Date.now();
      sessionRef.current = { id, startedAt };
      startSession({ id, projectId });
      setSeconds(0);
      tick.current = setInterval(
        () => setSeconds(Math.round((Date.now() - startedAt) / 1000)),
        1000
      );
      setRunning(true);
    }
  };

  useEffect(() => () => stopSession(), [stopSession]);

  const isBody = counterName === 'body';

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}>
            <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.projectName} numberOfLines={1}>
              {project?.name ?? 'Project'}
            </Text>
            <Text style={styles.counterTitle}>
              {isBody ? 'Body' : 'Sleeves'}
            </Text>
          </View>
          <Pressable
            onPress={toggleTimer}
            style={[styles.iconBtn, running && styles.iconBtnActive]}
            hitSlop={8}
            accessibilityLabel='Toggle timer'>
            <Timer
              size={19}
              strokeWidth={2.75}
              color={running ? color.bg : color.text}
            />
          </Pressable>
        </View>

        <View style={styles.switcher}>
          <Pressable
            onPress={() =>
              router.setParams({ counter: 'body' })
            }
            style={[styles.chip, isBody && styles.chipActive]}>
            <Text style={[styles.chipText, isBody && styles.chipTextActive]}>
              Body
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.setParams({ counter: 'sleeve' })}
            style={[styles.chip, !isBody && styles.chipActive]}>
            <Text style={[styles.chipText, !isBody && styles.chipTextActive]}>
              Sleeves
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={inc}
          style={styles.ringWrap}
          accessibilityLabel='Advance one row'>
          <ProgressRing
            progress={pct}
            size={248}
            stroke={16}
            trackColor={color.neutral[300]}
            fillColor={color.accent}>
            <View style={styles.ringCenter}>
              <Text style={styles.count}>{row}</Text>
              <Text style={styles.countOf}>
                of {total} {unit}
              </Text>
              <Text style={styles.tapHint}>Tap to advance</Text>
            </View>
          </ProgressRing>
        </Pressable>

        <View style={styles.instructionCard}>
          <Text style={styles.kicker}>
            {isBody ? 'Row' : 'Round'} {row} · chart B
          </Text>
          <Text style={styles.instruction}>{instruction}</Text>
          <Text style={styles.stitchMeta}>{stitchCount} sts on the needle</Text>
        </View>

        <View style={styles.repeatCard}>
          <View style={styles.repeatTop}>
            <Text style={styles.repeatLabel}>
              Stripe repeat · {REPEAT_LEN} rows
            </Text>
            <Text style={styles.repeatValue}>
              {repeatIdx
                ? `repeat ${repeatIdx} of ${repeatsTotal} · row ${withinRepeat} of ${REPEAT_LEN}`
                : 'cast on'}
            </Text>
          </View>
          <View style={styles.repeatTrack}>
            <View
              style={[styles.repeatFill, { width: `${repeatPct * 100}%` }]}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            onPress={dec}
            style={styles.ctrlSecondary}
            accessibilityLabel='Back one row'>
            <Minus size={30} strokeWidth={2.75} color={color.text} />
          </Pressable>
          <Pressable
            onPress={inc}
            style={styles.ctrlPrimary}
            accessibilityLabel='Advance one row'>
            <Plus size={42} strokeWidth={2.75} color={color.bg} />
          </Pressable>
          <Pressable
            onPress={() => reset(projectId, counterName)}
            style={styles.ctrlSecondary}
            accessibilityLabel='Reset counter'>
            <RotateCcw size={26} strokeWidth={2.75} color={color.text} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <View style={styles.sessionChip}>
            <View
              style={[
                styles.sessionDot,
                { backgroundColor: running ? color.acc2[600] : color.neutral[400] },
              ]}
            />
            <Text style={styles.sessionTime}>{fmtClock(seconds)}</Text>
          </View>
          <Pressable
            onPress={() =>
              router.push({ pathname: '/pattern/[id]', params: { id: projectId } })
            }
            style={styles.fullPattern}>
            <Text style={styles.fullPatternText}>Full pattern</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconBtn: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: color.acc2[600] },
  projectName: {
    textAlign: 'center',
    fontFamily: font.body,
    fontSize: 11,
    color: color.neutral[700],
  },
  counterTitle: {
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 16,
    color: color.text,
  },

  switcher: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
  },
  chipActive: { backgroundColor: color.accent },
  chipText: { fontFamily: font.bodySemi, fontSize: 13, color: color.text },
  chipTextActive: { color: color.bg },

  ringWrap: { alignSelf: 'center', marginBottom: 22 },
  ringCenter: { alignItems: 'center', justifyContent: 'center' },
  count: {
    fontFamily: font.heading,
    fontSize: 76,
    lineHeight: 80,
    color: color.text,
  },
  countOf: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
  },
  tapHint: {
    marginTop: 6,
    fontFamily: font.serif,
    fontSize: 12,
    color: color.neutral[600],
  },

  instructionCard: {
    backgroundColor: color.surface,
    borderRadius: radius.md,
    paddingVertical: 17,
    paddingHorizontal: 19,
    marginBottom: 12,
  },
  kicker: {
    fontFamily: font.serif,
    fontSize: 13,
    color: color.neutral[600],
    marginBottom: 7,
  },
  instruction: {
    fontFamily: font.body,
    fontSize: 16.5,
    lineHeight: 24,
    color: color.text,
  },
  stitchMeta: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.neutral[700],
    marginTop: 8,
  },

  repeatCard: {
    backgroundColor: color.acc2[200],
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 18,
    marginBottom: 26,
  },
  repeatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 9,
    gap: 8,
  },
  repeatLabel: {
    fontFamily: font.body,
    fontSize: 13,
    color: color.acc2[900],
  },
  repeatValue: {
    fontFamily: font.bodySemi,
    fontSize: 12,
    color: color.acc2[900],
    flexShrink: 1,
    textAlign: 'right',
  },
  repeatTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(32,30,29,0.14)',
    overflow: 'hidden',
  },
  repeatFill: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[700],
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 26,
    marginBottom: 22,
  },
  ctrlSecondary: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: color.divider,
    backgroundColor: color.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlPrimary: {
    width: 104,
    height: 104,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.md,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sessionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
  },
  sessionDot: { width: 9, height: 9, borderRadius: radius.pill },
  sessionTime: { fontFamily: font.body, fontSize: 13, color: color.text },
  fullPattern: {
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPatternText: {
    fontFamily: font.bodySemi,
    fontSize: 13,
    color: color.text,
  },
});
