import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import OnHold from '@assets/icons/on_hold.svg';
import * as ImagePicker from 'expo-image-picker';

import Done from '@assets/icons/done.svg';
import Planned from '@assets/icons/planned.svg';
import InProgress from '@assets/icons/in_progress.svg';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import {
  addProgressPic,
  listProgressPicsByProject,
} from '@src/db/progressPicsRepo';
import { persistPickedImage } from '@src/lib/persistImage';
import { Image } from 'react-native';

import ChevronLeft from '@assets/icons/chevron_left.svg';
import MoreIcon from '@assets/icons/more_vertical.svg';
import { PhotoRef, Project, getProjectById } from '@src/db/projectsRepo';
import { SoftPulseTimer } from '@src/components/ui/CraftingTimer';
import {
  getProjectLastSession,
  getProjectSecondsThisWeek,
  getProjectSecondsToday,
  getProjectStreakDays,
  getProjectTotalSeconds,
} from '@src/db/sessionsRepo';
import { ProgressPicsSection } from '@src/components/ui/ProgressPicsSection';
import { ProgressPic } from '@src/db/progressPicsRepo';
import { randomUUID } from 'expo-crypto';

export default function ProjectDetailsScreen() {
  type Status = 'On hold' | 'In progress' | 'Planned' | 'Done';

  // TEMP: later load from project / computed from counters
  const status: Status = 'In progress';
  const progress = 0.4; // later: currentRows / targetRows
  const currentRows = Math.round(progress * 250);
  const targetRows = 250;
  type LastSession = { endedAt: string; durationSeconds: number };

  const [totalSeconds, setTotalSeconds] = React.useState(0);
  const [todaySeconds, setTodaySeconds] = React.useState(0);
  const [weekSeconds, setWeekSeconds] = React.useState(0);
  const [streakDays, setStreakDays] = React.useState(0);
  const [lastSession, setLastSession] = React.useState<LastSession | null>(
    null
  );
  const [progressPics, setProgressPics] = React.useState<ProgressPic[]>([]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = React.useState<Project | null>(null);
  // const totalSeconds = getProjectTotalSeconds(project?.id);
  useFocusEffect(
    React.useCallback(() => {
      let alive = true;

      (async () => {
        if (!id) return;

        const p = await getProjectById(id);
        if (!alive) return;
        setProject(p);

        if (!p) return;

        // These come from your sessions repo (implement next)
        const tz = 'Europe/Bucharest';

        const total = getProjectTotalSeconds(p.id);
        const today = getProjectSecondsToday(p.id, tz);
        const week = getProjectSecondsThisWeek(p.id, tz);
        const streak = getProjectStreakDays(p.id, tz);
        const last = getProjectLastSession(p.id);
        if (p) {
          const pics = listProgressPicsByProject(p.id, 50);
          setProgressPics(pics);
        }
        if (!alive) return;
        setTotalSeconds(total);
        setTodaySeconds(today);
        setWeekSeconds(week);
        setStreakDays(streak);
        setLastSession(last);
      })();

      return () => {
        alive = false;
      };
    }, [id])
  );

  return (
    <View style={styles.root}>
      {/* White “sheet” that scrolls */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={10}>
            <ChevronLeft width={18} height={18} />
          </Pressable>

          <Text style={styles.title} numberOfLines={1}>
            {project?.name || 'Project'}
          </Text>

          <Pressable onPress={() => {}} style={styles.iconBtn} hitSlop={10}>
            <MoreIcon width={18} height={18} />
          </Pressable>
        </View>

        <CoverCardReadonly
          status={status}
          imageUri={project?.photos?.[0]?.uri ?? ''}
          startLabel='1 Sep'
          endLabel='1 Oct'
          current={currentRows}
          target={targetRows}
        />
        <View style={styles.aboutYarn}>
          <Text style={styles.text}>Yarn</Text>
          {project?.yarnId ? (
            <Text style={styles.subtitle}>{project?.yarnId}</Text>
          ) : (
            <Text style={styles.subtitle}>
              No yarn chosen yet. Let's pick your colors!
            </Text>
          )}
        </View>
        <View style={styles.pattern}>
          <Text style={styles.text}>Pattern</Text>
          {project?.patternLink ? (
            <View>
              <Text style={styles.subtitle}>{project?.patternLink}</Text>
            </View>
          ) : (
            <Text style={styles.subtitle}>No pattern chosen yet. </Text>
          )}
        </View>

        <View style={styles.pattern}>
          <Text style={styles.text}>Crafting Time</Text>

          <View style={styles.timeCard}>
            <Text style={styles.timeBig}>{formatDuration(totalSeconds)}</Text>
            <Text style={styles.timeLabel}>Total crafting time</Text>

            <View style={styles.timeRow}>
              <TimeStat label='Today' value={formatDuration(todaySeconds)} />
              <TimeStat label='This week' value={formatDuration(weekSeconds)} />
              {streakDays > 0 ? (
                <TimeStat label='Streak' value={`${streakDays}d`} />
              ) : null}
            </View>

            <View style={styles.lastSessionRow}>
              <Text style={styles.lastSessionLabel}>Last session</Text>
              <Text style={styles.lastSessionValue}>
                {lastSession
                  ? `${formatDuration(
                      lastSession.durationSeconds
                    )} · ${formatWhen(lastSession.endedAt)}`
                  : 'No sessions yet'}
              </Text>
            </View>

            {/* Optional: navigation to your working screen */}
            <Pressable
              style={styles.timeCta}
              onPress={() =>
                router.push({
                  pathname: '/projects/[id]/work',
                  params: { id: project?.id },
                })
              }
              disabled={!project?.id}>
              <Text style={styles.timeCtaText}>Work on this project</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.rowCounters}>
          <Text style={styles.text}>Row Counters</Text>
          <View style={styles.counterCard}>
            <Text style={styles.counterText}>Sleeves</Text>
          </View>
          {/* <Text style={styles.subtitle}>No counters yet - want me to keep count for you? </Text>} */}
        </View>

        <ProgressPicsSection
          photos={progressPics ?? []}
          onAddPress={async () => {
            if (!project) return;

            await pickAndSaveProgressPic(project.id);

            setProgressPics(listProgressPicsByProject(project.id, 1));
            // TODO: navigate to your add-photo flow
            // router.push({ pathname: "/projects/[id]/add-progress-pic", params: { id: project?.id } });
          }}
          onEditPress={(photoId) => {
            // TODO: navigate to edit screen (caption, delete, etc.)
            // router.push({ pathname: "/projects/[id]/edit-progress-pic", params: { id: project?.id, photoId } });
          }}
        />
      </ScrollView>
    </View>
  );
}
async function pickAndSaveProgressPic(projectId: string) {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 6,
    quality: 0.8,
  });
  if (result.canceled) return;

  const asset = result.assets[0];

  const photo: PhotoRef = {
    id: randomUUID(),
    uri: persistPickedImage(asset.uri, asset.mimeType),
    mimeType: asset.mimeType ?? 'image/jpeg',
    width: asset.width,
    height: asset.height,
  };

  addProgressPic({
    id: randomUUID(),
    projectId,
    photo,
  });
}
function TimeStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.timeStat}>
      <Text style={styles.timeStatLabel}>{label}</Text>
      <Text style={styles.timeStatValue}>{value}</Text>
    </View>
  );
}
function formatDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);

  if (h <= 0 && m <= 0) return '0m';
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function formatWhen(iso: string) {
  // keep it simple; later you can do better with date-fns
  const d = new Date(iso);
  const now = new Date();

  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  if (isYesterday) return 'Yesterday';

  return d.toLocaleDateString();
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 50,
  },
  timeCard: {
    marginTop: 10,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  timeBig: {
    fontSize: 34,
    fontFamily: 'Quicksand_700Bold',
    color: '#111827',
  },
  timeLabel: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Quicksand_500Medium',
    color: '#6B7280',
  },
  timeRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  timeStat: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F9FAFB',
  },
  timeStatLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand_600SemiBold',
    color: '#6B7280',
  },
  timeStatValue: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
    color: '#111827',
  },
  lastSessionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  lastSessionLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand_600SemiBold',
    color: '#6B7280',
  },
  lastSessionValue: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: 'Quicksand_600SemiBold',
    color: '#111827',
  },
  timeCta: {
    marginTop: 12,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeCtaText: {
    fontSize: 14,
    fontFamily: 'Quicksand_700Bold',
    color: '#FFFFFF',
  },
  counterCard: {
    borderRadius: 18,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  content: {
    minHeight: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  aboutYarn: {
    display: 'flex',
    marginTop: 20,
    gap: 10,
  },
  pattern: {
    display: 'flex',
    marginTop: 20,
    gap: 10,
  },
  rowCounters: {
    display: 'flex',
    marginTop: 20,
    gap: 10,
  },
  text: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 18,
  },
  subtitle: {
    fontFamily: 'Quicksand_400Regular',
    color: '#545454',
    fontSize: 14,
  },
  counterText: {
    fontFamily: 'Quicksand_600SemiBold',
    color: '#545454',
    fontSize: 14,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Fraunces_500Medium',
  },
  placeholder: {
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
});
function CoverCardReadonly({
  status,
  imageUri,
  startLabel,
  endLabel,
  current,
  target,
}: {
  status: 'On hold' | 'In progress' | 'Planned' | 'Done';
  imageUri: string;
  startLabel: string; // "1 Sep"
  endLabel: string; // "1 Oct"
  current: number; // e.g. 100 rows
  target: number; // e.g. 250 rows
}) {
  const progress = target <= 0 ? 0 : Math.max(0, Math.min(1, current / target));
  const pct = Math.round(progress * 100);

  return (
    <View style={cover.card}>
      <View style={cover.topRow}>
        <StatusPill label={status} />
      </View>

      <Image source={{ uri: imageUri }} style={cover.image} />

      <View style={cover.progressRow}>
        <Text style={cover.date}>{startLabel}</Text>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={cover.bar}>
            <View style={[cover.fill, { width: `${pct}%` }]} />
            <View style={[cover.knob, { left: `${pct}%` }]} />
          </View>

          <Text style={cover.pct}>{pct}%</Text>
          <Text style={cover.meta}>
            ({current} / {target} rows)
          </Text>
        </View>

        <Text style={cover.date}>{endLabel}</Text>
      </View>
    </View>
  );
}
const STATUS_CONFIG = {
  'On hold': {
    Icon: OnHold,
  },
  'In progress': {
    Icon: InProgress,
  },
  'Planned': {
    Icon: Planned,
  },
  'Done': { Icon: Done },
};
function StatusPill({
  label,
}: {
  label: 'On hold' | 'In progress' | 'Planned' | 'Done';
}) {
  const { Icon } = STATUS_CONFIG[label];

  return (
    <View style={cover.statusPill}>
      <Icon width={14} height={14} />
      <Text style={cover.statusText}>{label}</Text>
    </View>
  );
}

const cover = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  topRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusPill: {
    paddingVertical: 7,
    borderRadius: 999,
    justifyContent: 'flex-start',
    // backgroundColor: '#111827',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    alignContent: 'flex-start',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    textAlign: 'left',

    fontFamily: 'Quicksand_800ExtraBold',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  progressRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  date: {
    width: 42,
    textAlign: 'center',
    fontSize: 12,
    color: '#6B7280',
  },
  bar: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  fill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  knob: {
    position: 'absolute',
    top: -5,
    marginLeft: -7,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#111827',
  },
  pct: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  meta: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
  },
});
