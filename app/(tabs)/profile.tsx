import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  User,
  Bell,
  Ruler,
  Download,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { usePrefs } from '@src/store/prefs';
import { listProjects } from '@src/db/projectsRepo';
import {
  getProjectTotalSeconds,
  getGlobalStreakDays,
} from '@src/db/sessionsRepo';
import { useProgress, projectPercent } from '@src/store/progress';

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const APP_VERSION = '1.4.0';

function StatTile({
  value,
  label,
  tint,
}: {
  value: string;
  label: string;
  tint: 'sage' | 'terracotta';
}) {
  const bg = tint === 'sage' ? color.acc2[200] : color.acc[100];
  const fg = tint === 'sage' ? color.acc2[900] : color.acc[800];
  return (
    <View style={[styles.stat, { backgroundColor: bg }]}>
      <Text style={[styles.statValue, { color: fg }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: fg }]}>{label}</Text>
    </View>
  );
}

function SettingsRow({
  Icon,
  label,
  value,
  chevron,
  last,
  onPress,
}: {
  Icon: typeof User;
  label: string;
  value?: string;
  chevron?: boolean;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <>
      <Pressable style={styles.setRow} onPress={onPress}>
        <Icon size={20} strokeWidth={2.75} color={color.acc[700]} />
        <Text style={styles.setLabel}>{label}</Text>
        {value ? <Text style={styles.setValue}>{value}</Text> : null}
        {chevron ? (
          <ChevronRight
            size={17}
            strokeWidth={2.75}
            color={color.neutral[600]}
          />
        ) : null}
      </Pressable>
      {!last && <View style={styles.setDivider} />}
    </>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const name = usePrefs((s) => s.name);
  const counters = useProgress((s) => s.counters);

  const [stats, setStats] = useState({ finished: 0, hours: 0, streak: 0 });
  useFocusEffect(
    useCallback(() => {
      const projects = listProjects();
      const seconds = projects.reduce(
        (n, p) => n + getProjectTotalSeconds(p.id),
        0,
      );
      const finished = projects.filter(
        (p) => projectPercent(counters, p.id) >= 1,
      ).length;
      setStats({
        finished,
        hours: Math.round(seconds / 3600),
        streak: getGlobalStreakDays(TZ),
      });
    }, [counters]),
  );

  const initial = (name?.trim()?.[0] ?? '·').toUpperCase();

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.name} numberOfLines={1}>
              {name || 'You'}
            </Text>
            <Text style={styles.tagline}>Knitting since 2019 · Romania</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <StatTile
            value={String(stats.finished)}
            label='finished'
            tint='sage'
          />
          <StatTile
            value={`${stats.hours}h`}
            label='on the needles'
            tint='sage'
          />
          <StatTile
            value={String(stats.streak)}
            label='day streak'
            tint='terracotta'
          />
        </View>

        <Text style={styles.h4}>Settings</Text>
        <View style={styles.settingsCard}>
          <SettingsRow Icon={User} label='Account' chevron />
          <SettingsRow Icon={Bell} label='Reminders' value='20:00 daily' />
          <SettingsRow Icon={Ruler} label='Units & gauge' value='Metric' />
          <SettingsRow Icon={Download} label='Backup & export' chevron />
          <SettingsRow
            Icon={Info}
            label='About Little Loop'
            value={APP_VERSION}
            last
          />
        </View>
        <Text style={styles.footnote}>
          Settings live here now — no floating button over your work.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingTop: 64, paddingHorizontal: 22 },

  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 22,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: color.acc[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: font.heading,
    fontSize: 28,
    color: color.acc[900],
  },
  name: { fontFamily: font.heading, fontSize: 24, color: color.text },
  tagline: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
    marginTop: 2,
  },

  statRow: { flexDirection: 'row', gap: 10, marginBottom: 26 },
  stat: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statValue: { fontFamily: font.heading, fontSize: 24 },
  statLabel: { fontFamily: font.body, fontSize: 11, marginTop: 2 },

  h4: {
    fontFamily: font.heading,
    fontSize: 18,
    color: color.text,
    marginBottom: 10,
  },
  settingsCard: {
    backgroundColor: color.surface,
    borderRadius: 18,
    overflow: 'hidden',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    minHeight: 56,
    paddingHorizontal: 18,
  },
  setLabel: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 14.5,
    color: color.text,
  },
  setValue: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
  },
  setDivider: {
    height: 1,
    backgroundColor: color.divider,
    marginHorizontal: 18,
  },
  footnote: {
    fontFamily: font.body,
    fontSize: 11.5,
    color: color.neutral[700],
    marginTop: 14,
  },
});
