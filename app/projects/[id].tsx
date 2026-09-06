import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  ChevronLeft,
  MoreVertical,
  Plus,
  FileText,
} from 'lucide-react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { randomUUID } from 'expo-crypto';

import { color, font, radius, HIT } from '@src/theme/theme';
import Tag from '@src/components/ui/Tag';
import StitchTexture from '@src/components/ui/StitchTexture';
import {
  PhotoRef,
  Project,
  deleteProject,
  getProjectById,
} from '@src/db/projectsRepo';
import {
  getProjectSecondsThisWeek,
  getProjectSecondsToday,
  getProjectTotalSeconds,
} from '@src/db/sessionsRepo';
import {
  addProgressPic,
  listProgressPicsByProject,
  type ProgressPic,
} from '@src/db/progressPicsRepo';
import { persistPickedImage } from '@src/lib/persistImage';
import {
  useProgress,
  projectPercent,
  PRIMARY_COUNTER,
  type Counter,
} from '@src/store/progress';

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

type Status = 'Planned' | 'In progress' | 'Done';

function parseTarget(s?: string | null): number {
  if (!s) return 0;
  const n = parseInt(String(s).replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(n) ? n : 0;
}

function daysLeft(endDate?: string | null): number | null {
  if (!endDate) return null;
  const ms = new Date(endDate).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

function fmtDuration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h <= 0 && m <= 0) return '0m';
  if (h <= 0) return `${m}m`;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });
}

export default function ProjectDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [pics, setPics] = useState<ProgressPic[]>([]);
  const [time, setTime] = useState({ total: 0, today: 0, week: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  const counters = useProgress((s) => s.counters);
  const setCounter = useProgress((s) => s.setCounter);

  const load = useCallback(async () => {
    if (!id) return;
    const p = await getProjectById(id);
    setProject(p);
    if (!p) return;
    setPics(listProgressPicsByProject(p.id, 12));
    setTime({
      total: getProjectTotalSeconds(p.id),
      today: getProjectSecondsToday(p.id, TZ),
      week: getProjectSecondsThisWeek(p.id, TZ),
    });
    // Seed the primary counter's total from the project target so the counter
    // screen has something real to count towards.
    const target = parseTarget(p.targetMeasurement);
    const existing = counters[p.id]?.[PRIMARY_COUNTER];
    if (target > 0 && (!existing || existing.total !== target)) {
      setCounter(p.id, PRIMARY_COUNTER, { total: target });
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = () => {
    setMenuOpen(false);
    if (!project) return;
    Alert.alert('Delete project?', "This can't be undone.", [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProject(project.id);
          router.back();
        },
      },
    ]);
  };

  const pct = project ? projectPercent(counters, project.id) : 0;
  const pctLabel = `${Math.round(pct * 100)}%`;
  const primary: Counter | undefined = project
    ? counters[project.id]?.[PRIMARY_COUNTER]
    : undefined;
  const target = parseTarget(project?.targetMeasurement);
  const dl = daysLeft(project?.endDate);

  const status: Status = !project?.startDate
    ? 'Planned'
    : pct >= 1
    ? 'Done'
    : 'In progress';
  const STATUS_TINT: Record<Status, string> = {
    Planned: color.neutral[400],
    'In progress': color.acc2[600],
    Done: color.acc2[700],
  };

  const projectCounters = project ? counters[project.id] ?? {} : {};
  const counterNames = Object.keys(projectCounters);
  const shownCounters = counterNames.length
    ? counterNames
    : [PRIMARY_COUNTER];

  const openCounter = (name: string) =>
    project &&
    router.push({
      pathname: '/counter/[id]',
      params: { id: project.id, counter: name },
    });

  const addPic = async () => {
    if (!project) return;
    await pickAndSaveProgressPic(project.id);
    setPics(listProgressPicsByProject(project.id, 12));
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 56, paddingBottom: 28 + insets.bottom },
        ]}>
        {/* header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}>
            <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {project?.name ?? 'Project'}
          </Text>
          <Pressable
            onPress={() => setMenuOpen((v) => !v)}
            style={styles.iconBtn}
            hitSlop={8}>
            <MoreVertical size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
        </View>

        {/* status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View
              style={[styles.statusDot, { backgroundColor: STATUS_TINT[status] }]}
            />
            <Text style={styles.statusText}>{status}</Text>
            {dl != null && (
              <View style={{ marginLeft: 'auto' }}>
                <Tag
                  label={dl >= 0 ? `${dl} days left` : `${-dl} days over`}
                  variant='neutral'
                />
              </View>
            )}
          </View>

          {project?.photos?.[0]?.uri ? (
            <Image
              source={{ uri: project.photos[0].uri }}
              style={styles.photo}
            />
          ) : (
            <StitchTexture
              from={color.neutral[800]}
              to={color.neutral[200]}
              band={11}
              style={styles.photo}
            />
          )}

          <View style={styles.sliderWrap}>
            <View style={styles.track}>
              <View style={[styles.trackFill, { width: `${pct * 100}%` }]} />
              <View style={[styles.knob, { left: `${pct * 100}%` }]} />
            </View>
            <View style={styles.sliderMeta}>
              <Text style={styles.date}>{fmtDate(project?.startDate)}</Text>
              <Text style={styles.pctBig}>{pctLabel}</Text>
              <Text style={styles.date}>{fmtDate(project?.endDate)}</Text>
            </View>
            <Text style={styles.rowsMeta}>
              {primary
                ? `${primary.current} of ${primary.total} rows`
                : target > 0
                ? `0 of ${target} rows`
                : 'No target set'}
            </Text>
          </View>
        </View>

        {/* materials */}
        <Text style={styles.h4}>Materials</Text>
        <View style={styles.grid}>
          <View style={styles.tile}>
            <Text style={styles.kicker}>Yarn</Text>
            <View style={styles.yarnRow}>
              <View style={styles.yarnDot} />
              <Text style={styles.tileValue} numberOfLines={1}>
                {project?.yarnId ?? 'Not set'}
              </Text>
            </View>
          </View>
          <View style={styles.tile}>
            <Text style={styles.kicker}>Tools</Text>
            <Text style={styles.tileValue}>{project?.tools ?? 'Not set'}</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.kicker}>Skeins</Text>
            <Text style={styles.tileValue}>
              {project?.skeins != null ? String(project.skeins) : '—'}
            </Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.kicker}>Target</Text>
            <Text style={styles.tileValue}>
              {project?.targetMeasurement ?? '—'}
            </Text>
          </View>
        </View>

        {/* pattern */}
        <View style={styles.sectionHead}>
          <Text style={styles.h4}>Pattern</Text>
          {(project?.patternFile || project?.patternLink) && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/pattern/[id]',
                  params: { id: project!.id },
                })
              }>
              <Text style={styles.ghost}>Open</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.patternCard}
          onPress={() =>
            project &&
            router.push({
              pathname: '/pattern/[id]',
              params: { id: project.id },
            })
          }>
          <View style={styles.patternIcon}>
            <FileText size={19} strokeWidth={2.75} color={color.acc[800]} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.patternName} numberOfLines={1}>
              {project?.patternFile?.name ??
                project?.patternLink ??
                'No pattern yet'}
            </Text>
            <Text style={styles.patternSub} numberOfLines={1}>
              {project?.patternFile
                ? 'PDF attached'
                : project?.patternLink
                ? 'Linked'
                : 'Add one from project settings'}
            </Text>
          </View>
        </Pressable>

        {/* crafting time */}
        <Text style={styles.h4}>Crafting time</Text>
        <View style={styles.timeCard}>
          <View style={styles.timeTopRow}>
            <Text style={styles.timeBig}>{fmtDuration(time.total)}</Text>
            <Text style={styles.timeBigLabel}>total on this project</Text>
          </View>
          <View style={styles.timeTiles}>
            <View style={styles.timeTile}>
              <Text style={styles.timeTileLabel}>Today</Text>
              <Text style={styles.timeTileValue}>{fmtDuration(time.today)}</Text>
            </View>
            <View style={styles.timeTile}>
              <Text style={styles.timeTileLabel}>This week</Text>
              <Text style={styles.timeTileValue}>{fmtDuration(time.week)}</Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
            onPress={() => openCounter(PRIMARY_COUNTER)}>
            <Text style={styles.primaryBtnText}>Work on this project</Text>
          </Pressable>
        </View>

        {/* counters */}
        <View style={styles.sectionHead}>
          <Text style={styles.h4}>Counters</Text>
          <Pressable
            style={styles.smallAdd}
            onPress={() => openCounter(PRIMARY_COUNTER)}
            accessibilityLabel='Add counter'>
            <Plus size={19} strokeWidth={2.75} color={color.text} />
          </Pressable>
        </View>
        <View style={styles.counterRow}>
          {shownCounters.map((name) => {
            const c = projectCounters[name] ?? { current: 0, total: target };
            return (
              <Pressable
                key={name}
                style={styles.counterCard}
                onPress={() => openCounter(name)}>
                <Text style={styles.kicker}>{name}</Text>
                <Text style={styles.counterCount}>{c.current}</Text>
                <Text style={styles.counterOf}>
                  of {c.total || target || '—'} rows
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* progress pics */}
        <View style={styles.sectionHead}>
          <Text style={styles.h4}>Progress pics</Text>
          <Pressable
            style={styles.smallAdd}
            onPress={addPic}
            accessibilityLabel='Add photo'>
            <Plus size={19} strokeWidth={2.75} color={color.text} />
          </Pressable>
        </View>
        <View style={styles.picsRow}>
          {pics.slice(0, 3).map((p) => (
            <Image
              key={p.id}
              source={{ uri: p.photo.uri }}
              style={styles.picSlot}
            />
          ))}
          {pics.length < 3 && (
            <Pressable style={styles.picAdd} onPress={addPic}>
              <Plus size={20} strokeWidth={2.75} color={color.neutral[600]} />
            </Pressable>
          )}
        </View>
      </ScrollView>

      {menuOpen && (
        <>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuOpen(false)}
          />
          <View style={[styles.menu, { top: insets.top + 46 }]}>
            <Pressable
              onPress={() => setMenuOpen(false)}
              style={styles.menuItem}>
              <Text style={styles.menuText}>Edit</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable onPress={handleDelete} style={styles.menuItem}>
              <Text style={[styles.menuText, styles.menuDanger]}>Delete</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

async function pickAndSaveProgressPic(projectId: string) {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return;
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
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
  addProgressPic({ id: randomUUID(), projectId, photo });
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconBtn: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 17,
    color: color.text,
  },

  statusCard: {
    backgroundColor: color.surface,
    borderRadius: radius.cardLg,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 14,
  },
  statusDot: { width: 26, height: 26, borderRadius: radius.pill },
  statusText: { fontFamily: font.heading, fontSize: 15, color: color.text },
  photo: {
    height: 176,
    borderRadius: 24,
    backgroundColor: color.neutral[200],
  },
  sliderWrap: { marginTop: 18, paddingHorizontal: 4 },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: color.neutral[300],
    justifyContent: 'center',
  },
  trackFill: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[600],
  },
  knob: {
    position: 'absolute',
    marginLeft: -13,
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: color.bg,
    borderWidth: 3,
    borderColor: color.acc2[700],
  },
  sliderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 14,
  },
  date: { fontFamily: font.body, fontSize: 11.5, color: color.neutral[700] },
  pctBig: { fontFamily: font.heading, fontSize: 17, color: color.text },
  rowsMeta: {
    textAlign: 'center',
    fontFamily: font.body,
    fontSize: 11.5,
    color: color.neutral[700],
    marginTop: 2,
  },

  h4: {
    fontFamily: font.heading,
    fontSize: 18,
    color: color.text,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 10,
  },
  ghost: { fontFamily: font.bodySemi, fontSize: 13, color: color.accent },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  tile: {
    width: '48.5%',
    backgroundColor: color.surface,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: color.acc[700],
    marginBottom: 5,
  },
  tileValue: { fontFamily: font.body, fontSize: 13.5, color: color.text },
  yarnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  yarnDot: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    backgroundColor: color.neutral[400],
  },

  patternCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: color.surface,
    borderRadius: 22,
    padding: 15,
  },
  patternIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: color.acc[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternName: { fontFamily: font.body, fontSize: 13.5, color: color.text },
  patternSub: {
    fontFamily: font.body,
    fontSize: 11.5,
    color: color.neutral[700],
    marginTop: 2,
  },

  timeCard: {
    backgroundColor: color.acc2[200],
    borderRadius: 28,
    padding: 18,
  },
  timeTopRow: { flexDirection: 'row', alignItems: 'baseline', gap: 9 },
  timeBig: {
    fontFamily: font.heading,
    fontSize: 34,
    lineHeight: 36,
    color: color.acc2[900],
  },
  timeBigLabel: { fontFamily: font.body, fontSize: 12, color: color.acc2[900] },
  timeTiles: { flexDirection: 'row', gap: 10, marginTop: 14 },
  timeTile: {
    flex: 1,
    backgroundColor: 'rgba(245,234,216,0.72)',
    borderRadius: 18,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  timeTileLabel: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.neutral[700],
  },
  timeTileValue: {
    fontFamily: font.heading,
    fontSize: 17,
    color: color.text,
    marginTop: 2,
  },
  primaryBtn: {
    marginTop: 16,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnPressed: { backgroundColor: color.acc[600] },
  primaryBtnText: {
    fontFamily: font.bodySemi,
    fontSize: 15,
    color: color.bg,
  },

  smallAdd: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterRow: { flexDirection: 'row', gap: 12 },
  counterCard: {
    flex: 1,
    backgroundColor: color.surface,
    borderRadius: 26,
    padding: 16,
  },
  counterCount: {
    fontFamily: font.heading,
    fontSize: 30,
    lineHeight: 35,
    color: color.text,
    marginVertical: 2,
    textTransform: 'capitalize',
  },
  counterOf: {
    fontFamily: font.body,
    fontSize: 11.5,
    color: color.neutral[700],
  },

  picsRow: { flexDirection: 'row', gap: 10 },
  picSlot: {
    flex: 1,
    height: 84,
    borderRadius: 20,
    backgroundColor: color.neutral[200],
  },
  picAdd: {
    flex: 1,
    height: 84,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: {
    position: 'absolute',
    right: 16,
    minWidth: 160,
    backgroundColor: color.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  menuItem: { paddingVertical: 13, paddingHorizontal: 16 },
  menuText: { fontFamily: font.bodySemi, fontSize: 15, color: color.text },
  menuDanger: { color: color.accent },
  menuDivider: { height: 1, backgroundColor: color.divider },
});
