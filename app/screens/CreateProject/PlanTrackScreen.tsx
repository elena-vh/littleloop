// src/screens/PlanTrackScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image, Alert } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WizardHeader from './WizardHeader';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { createProject } from '@src/db/projectsRepo';
import { useProjectDraft } from '@src/store/projectDraft';
import { listProjects } from '@src/db/projectsRepo';
import { persistPickedImage } from '@src/lib/persistImage';

type Props = {
  onSave?: () => void;
};
function toIsoDate(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
}
type PickerTarget = 'start' | 'end';

type PhotoRef = {
  id: string;
  uri: string;
  mimeType?: string;
  width?: number;
  height?: number;
};

const MAX_BYTES = 500 * 1024; // 500kb

export default function PlanTrackScreen() {
  const insets = useSafeAreaInsets();
  const draft = useProjectDraft((s) => s.draft);
  const setPlan = useProjectDraft((s) => s.setPlan);
  const reset = useProjectDraft((s) => s.reset);

  const [startDate, setStartDate] = useState(() => new Date(2025, 7, 7)); // 07.08.2025
  const [endDate, setEndDate] = useState(() => new Date(2025, 8, 7)); // 07.09.2025
  const [activePicker, setActivePicker] = useState<PickerTarget>('start');

  const [monthCursor, setMonthCursor] = useState(
    () => new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  );

  const [targetMeasurement, setTargetMeasurement] = useState('50 rows');
  const [timeText] = useState('9:41 AM');

  const selectedDate = activePicker === 'start' ? startDate : endDate;

  const [photos, setPhotos] = useState<PhotoRef[]>([]);

  async function pickPhotos() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo access to add photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 6,
      quality: 0.8,
    });

    if (result.canceled) return;

    const picked: PhotoRef[] = result.assets.map((a) => ({
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      uri: persistPickedImage(a.uri, a.mimeType),
      mimeType: a.mimeType,
      width: a.width,
      height: a.height,
    }));

    // NOTE: expo-image-picker doesn't reliably give fileSize on all platforms.
    // We'll enforce the 500kb rule later if you want (see note below).

    setPhotos((prev) => [...prev, ...picked]);
  }
  const onSelectDate = (d: Date) => {
    if (activePicker === 'start') {
      setStartDate(d);
      // optional: if start > end, bump end
      if (d.getTime() > endDate.getTime()) setEndDate(d);
    } else {
      setEndDate(d);
      // optional: if end < start, bump start
      if (d.getTime() < startDate.getTime()) setStartDate(d);
    }
  };
  const onBack = () => router.back();

  const canSave = useMemo(
    () => targetMeasurement.trim().length > 0,
    [targetMeasurement]
  );
  console.log({ canSave });
  const onSave = () => {
    setPlan({
      startDate: toIsoDate(startDate),
      targetEndDate: toIsoDate(endDate),
      targetMeasurement,
    });
    const id = Crypto.randomUUID();
    const latest = useProjectDraft.getState().draft;

    createProject({
      id,
      craft: latest.craft ?? 'knitting',
      name: latest.name,
      tags: latest.tags,
      tools: latest.tools,
      skeins: latest.skeins,
      yarnId: latest.yarnId,
      patternLink: latest.patternLink || null,
      photos,
      // add more columns later when you extend your table
    });
    console.log('ALL PROJECTS:', listProjects());

    reset();
    // router.back();
    router.replace('/');
  };
  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}>
      <WizardHeader step={3} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>Plan &amp; track</Text>

        {/* Start / Target end */}
        <View style={styles.row2}>
          <Pressable
            onPress={() => setActivePicker('start')}
            style={[
              styles.smallCard,
              activePicker === 'start' && styles.smallCardActive,
            ]}>
            <Text style={styles.smallLabel}>Start</Text>
            <View style={styles.smallValueRow}>
              <Text style={styles.smallValue}>{formatDMY(startDate)}</Text>
              <Text style={styles.chev}>⌄</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setActivePicker('end')}
            style={[
              styles.smallCard,
              activePicker === 'end' && styles.smallCardActive,
            ]}>
            <Text style={styles.smallLabel}>Target end</Text>
            <View style={styles.smallValueRow}>
              <Text style={styles.smallValue}>{formatDMY(endDate)}</Text>
              <Text style={styles.chev}>⌄</Text>
            </View>
          </Pressable>
        </View>

        {/* Calendar */}
        <View style={styles.calendarCard}>
          <CalendarHeader
            monthCursor={monthCursor}
            onPrev={() => setMonthCursor(addMonths(monthCursor, -1))}
            onNext={() => setMonthCursor(addMonths(monthCursor, +1))}
          />

          <Weekdays />

          <MonthGrid
            monthCursor={monthCursor}
            selectedDate={selectedDate}
            startDate={startDate}
            endDate={endDate}
            onSelect={(d) => onSelectDate(d)}
          />

          {/* <View style={styles.calendarDivider} /> */}

          {/* <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Time</Text>

            <Pressable
              onPress={() => {
                // TODO: hook up a time picker (e.g. @react-native-community/datetimepicker)
              }}
              style={styles.timeChip}>
              <Text style={styles.timeChipText}>{timeText}</Text>
            </Pressable>
          </View> */}
        </View>

        {/* Target measurement */}
        <View style={styles.card}>
          <Text style={styles.label}>Target measurement</Text>
          <TextInput
            value={targetMeasurement}
            onChangeText={setTargetMeasurement}
            style={styles.inputBig}
            placeholder='e.g. 50 rows'
            placeholderTextColor='#999'
          />
        </View>

        {/* Photos */}
        <View style={styles.photoCard}>
          <View style={styles.photoTopRow}>
            <View>
              <Text style={styles.label}>Photos</Text>
              <Text style={styles.caption}>(max 500kb)</Text>
            </View>
            <Pressable
              onPress={pickPhotos}
              hitSlop={10}
              style={styles.uploadButton}
              accessibilityRole='button'
              accessibilityLabel='Upload photo'>
              <Text style={styles.uploadIcon}>⤴︎</Text>
            </Pressable>
            {/*
            <Pressable
              onPress={() => {
                // TODO: hook up image picker / document picker
              }}
              hitSlop={10}
              style={styles.uploadButton}
              accessibilityRole='button'
              accessibilityLabel='Upload photo'>
              <Text style={styles.uploadIcon}>⤴︎</Text>
            </Pressable> */}
          </View>
          <View style={styles.photosGrid}>
            {photos.length === 0 ? (
              <View style={styles.photoEmptyArea} />
            ) : (
              photos.map((p) => (
                <View key={p.id} style={styles.thumbWrap}>
                  <Image source={{ uri: p.uri }} style={styles.thumb} />
                  <Pressable
                    onPress={() =>
                      setPhotos((prev) => prev.filter((x) => x.id !== p.id))
                    }
                    hitSlop={10}
                    style={styles.thumbRemove}
                    accessibilityRole='button'
                    accessibilityLabel='Remove photo'>
                    <Text style={{ fontSize: 14 }}>✕</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
          {/* <View style={styles.photoEmptyArea} /> */}
        </View>

        <View style={{ height: 26 }} />

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <Pressable
            onPress={onBack}
            style={[styles.btn, styles.btnGhost]}
            accessibilityRole='button'>
            <Text style={styles.btnGhostText}>Back</Text>
          </Pressable>

          <Pressable
            onPress={canSave ? onSave : undefined}
            style={[
              styles.btn,
              styles.btnPrimary,
              !canSave && { opacity: 0.4 },
            ]}
            accessibilityRole='button'>
            <Text style={styles.btnPrimaryText}>Save Project</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- Calendar bits ---------- */

function CalendarHeader({
  monthCursor,
  onPrev,
  onNext,
}: {
  monthCursor: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.calHeader}>
      <Text style={styles.calMonthText}>{formatMonthYear(monthCursor)}</Text>

      <View style={styles.calArrows}>
        <Pressable onPress={onPrev} hitSlop={10} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Pressable onPress={onNext} hitSlop={10} style={styles.arrowBtn}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Weekdays() {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return (
    <View style={styles.weekRow}>
      {days.map((d) => (
        <Text key={d} style={styles.weekday}>
          {d}
        </Text>
      ))}
    </View>
  );
}

function MonthGrid({
  monthCursor,
  selectedDate,
  startDate,
  endDate,
  onSelect,
}: {
  monthCursor: Date;
  selectedDate: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const cells = useMemo(() => buildMonthCells(monthCursor), [monthCursor]);

  return (
    <View style={styles.grid}>
      {cells.map((cell, idx) => {
        if (!cell) return <View key={idx} style={styles.dayCell} />;

        const isSelected = isSameDay(cell, selectedDate);
        const isToday = isSameDay(cell, today);

        // optional range highlight (start..end)
        const inRange =
          cell.getTime() >= stripTime(startDate).getTime() &&
          cell.getTime() <= stripTime(endDate).getTime();

        return (
          <Pressable
            key={idx}
            onPress={() => onSelect(cell)}
            style={styles.dayCell} // wrapper
          >
            <View
              style={[
                styles.dayInner, // actual circle
                inRange && styles.inRange,
                isSelected && styles.daySelected,
              ]}>
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.daySelectedText,
                ]}>
                {cell.getDate()}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- utils ---------- */

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDMY(d: Date) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function formatMonthYear(d: Date) {
  const month = d.toLocaleString(undefined, { month: 'long' });
  return `${capitalize(month)} ${d.getFullYear()}`;
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildMonthCells(monthCursor: Date): Array<Date | null> {
  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();

  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay(); // 0..6 (Sun..Sat)

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<Date | null> = [];

  // leading blanks
  for (let i = 0; i < firstWeekday; i++) cells.push(null);

  // month days
  for (let day = 1; day <= daysInMonth; day++)
    cells.push(new Date(year, month, day));

  // trailing blanks to make full rows (7 columns)
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

/* ---------- styles ---------- */

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  photosGrid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3, // 👈 this creates the gap between circles
  },

  dayInner: {
    flex: 1,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // keep these as-is, but they now apply to dayInner
  inRange: {
    backgroundColor: '#F3F3F3',
  },
  daySelected: {
    backgroundColor: '#D7ECFF',
  },

  // and keep your text alignment fix
  dayText: {
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center' as any,
  },

  screen: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 22,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      //   default: 'Fraunces',
    }),
    // fontFamily: 'Fraunces_700Bold',
    color: '#111',
  },

  row2: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  smallCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    padding: 14,
    backgroundColor: '#FFF',
  },
  smallCardActive: {
    borderColor: '#CFCFCF',
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  smallValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallValue: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  chev: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },

  calendarCard: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    backgroundColor: '#FFF',
    padding: 14,
    marginBottom: 14,
    // shadow-ish like your other cards
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calMonthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  calArrows: {
    flexDirection: 'row',
    gap: 10,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 22,
    color: '#2F6FFF',
    marginTop: -2,
  },

  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    color: '#B0B0B0',
    letterSpacing: 0.4,
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 2,
  },

  todayText: {
    color: '#2F6FFF',
    fontWeight: '700',
  },
  daySelectedText: {
    color: '#1976FF',
    fontWeight: '800',
  },

  calendarDivider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 10,
  },
  timeRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#EFEFEF',
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  card: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  caption: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  inputBig: {
    fontSize: 16,
    color: '#111',
    paddingVertical: 6,
  },

  photoCard: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    padding: 16,
    backgroundColor: '#FFF',
  },
  photoTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  uploadButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  uploadIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  photoEmptyArea: {
    height: 74,
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    paddingTop: 6,
  },
  btn: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFF',
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  btnPrimary: {
    backgroundColor: '#111',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
