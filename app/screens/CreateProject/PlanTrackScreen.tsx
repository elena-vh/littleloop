import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Camera,
  X,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { createProject } from '@src/db/projectsRepo';
import { useProjectDraft } from '@src/store/projectDraft';
import { persistPickedImage } from '@src/lib/persistImage';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';

type PickerTarget = 'start' | 'end';
type PhotoRef = {
  id: string;
  uri: string;
  mimeType?: string;
  width?: number;
  height?: number;
};

const stripTime = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const fmtDMY = (d: Date) =>
  d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
const fmtMonthYear = (d: Date) =>
  `${d.toLocaleString(undefined, { month: 'long' })} ${d.getFullYear()}`;

// Monday-first month grid
function buildCells(cursor: Date): Array<Date | null> {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const lead = (new Date(y, m, 1).getDay() + 6) % 7; // Mon=0
  const days = new Date(y, m + 1, 0).getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function PlanTrackScreen() {
  const insets = useSafeAreaInsets();
  const setPlan = useProjectDraft((s) => s.setPlan);
  const reset = useProjectDraft((s) => s.reset);

  const today = stripTime(new Date());
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addMonths(today, 1));
  const [active, setActive] = useState<PickerTarget>('start');
  const [cursor, setCursor] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [target, setTarget] = useState('');
  const [photos, setPhotos] = useState<PhotoRef[]>([]);

  const selected = active === 'start' ? startDate : endDate;
  const canSave = target.trim().length > 0;

  const onSelect = (d: Date) => {
    if (active === 'start') {
      setStartDate(d);
      if (d.getTime() > endDate.getTime()) setEndDate(d);
    } else {
      setEndDate(d);
      if (d.getTime() < startDate.getTime()) setStartDate(d);
    }
  };

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (result.canceled) return;
    const a = result.assets[0];
    setPhotos((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        uri: persistPickedImage(a.uri, a.mimeType),
        mimeType: a.mimeType,
        width: a.width,
        height: a.height,
      },
    ]);
  };

  const onSave = () => {
    setPlan({
      startDate: startDate.toISOString(),
      targetEndDate: endDate.toISOString(),
      targetMeasurement: target,
    });
    const d = useProjectDraft.getState().draft;
    createProject({
      id: Crypto.randomUUID(),
      craft: d.craft ?? 'knitting',
      name: d.name,
      tags: d.tags,
      tools: d.tools || null,
      skeins: d.skeins ?? null,
      yarnId: d.yarnId ?? null,
      patternLink: d.patternLink || null,
      startDate,
      endDate,
      targetMeasurement: target,
      photos,
    });
    reset();
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 20 },
          ]}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
        <WizardHeader step={3} title='Plan & track' />

        <View style={styles.pillRow}>
          {(['start', 'end'] as const).map((k) => (
            <Pressable
              key={k}
              onPress={() => setActive(k)}
              style={[styles.datePill, active === k && styles.datePillActive]}>
              <Text style={styles.dateLabel}>
                {k === 'start' ? 'Start' : 'Target end'}
              </Text>
              <View style={styles.dateValueRow}>
                <Text style={styles.dateValue}>
                  {fmtDMY(k === 'start' ? startDate : endDate)}
                </Text>
                <ChevronDown
                  size={15}
                  strokeWidth={2.75}
                  color={color.neutral[600]}
                />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.calendar}>
          <View style={styles.calHead}>
            <Text style={styles.calMonth}>{fmtMonthYear(cursor)}</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <Pressable
                style={styles.calArrow}
                onPress={() => setCursor(addMonths(cursor, -1))}>
                <ChevronLeft
                  size={17}
                  strokeWidth={2.75}
                  color={color.acc[800]}
                />
              </Pressable>
              <Pressable
                style={styles.calArrow}
                onPress={() => setCursor(addMonths(cursor, 1))}>
                <ChevronRight
                  size={17}
                  strokeWidth={2.75}
                  color={color.acc[800]}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekRow}>
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
              <Text key={d} style={styles.weekday}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {buildCells(cursor).map((cell, i) => {
              if (!cell) return <View key={i} style={styles.cell} />;
              const inWindow =
                cell.getTime() >= startDate.getTime() &&
                cell.getTime() <= endDate.getTime();
              const isStart = isSameDay(cell, startDate);
              const isEnd = isSameDay(cell, endDate);
              const isSel = isSameDay(cell, selected);
              return (
                <Pressable
                  key={i}
                  style={styles.cell}
                  onPress={() => onSelect(cell)}>
                  <View
                    style={[
                      styles.dayInner,
                      inWindow && styles.dayInWindow,
                      (isStart || isEnd) && styles.dayEndpoint,
                      isSel && styles.daySelected,
                    ]}>
                    <Text
                      style={[
                        styles.dayText,
                        (isStart || isEnd) && styles.dayEndpointText,
                      ]}>
                      {cell.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Target measurement</Text>
          <TextInput
            value={target}
            onChangeText={setTarget}
            style={styles.input}
            placeholder='e.g. 250 rows'
            placeholderTextColor={color.neutral[600]}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>First photo</Text>
          {photos.length === 0 ? (
            <Pressable style={styles.photoSlot} onPress={pickPhoto}>
              <Camera size={19} strokeWidth={2.75} color={color.neutral[700]} />
              <Text style={styles.photoSlotText}>Add a cast-on shot</Text>
            </Pressable>
          ) : (
            <View style={styles.photoRow}>
              {photos.map((p) => (
                <View key={p.id} style={styles.thumbWrap}>
                  <Image source={{ uri: p.uri }} style={styles.thumb} />
                  <Pressable
                    style={styles.thumbX}
                    onPress={() =>
                      setPhotos((prev) => prev.filter((x) => x.id !== p.id))
                    }>
                    <X size={12} strokeWidth={3} color={color.text} />
                  </Pressable>
                </View>
              ))}
              <Pressable style={styles.thumbAdd} onPress={pickPhoto}>
                <Camera
                  size={18}
                  strokeWidth={2.75}
                  color={color.neutral[600]}
                />
              </Pressable>
            </View>
          )}
        </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <WizardFooter
            onBack={() => router.back()}
            onNext={onSave}
            nextLabel='Cast on'
            nextDisabled={!canSave}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: 22, paddingBottom: 24 },
  footer: { paddingHorizontal: 22, paddingTop: 4, backgroundColor: color.bg },

  pillRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  datePill: {
    flex: 1,
    backgroundColor: color.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  datePillActive: { borderColor: color.acc2[400] },
  dateLabel: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 5,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateValue: { fontFamily: font.heading, fontSize: 17, color: color.text },

  calendar: {
    backgroundColor: color.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  calHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  calMonth: { fontFamily: font.heading, fontSize: 17, color: color.text },
  calArrow: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: color.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekRow: { flexDirection: 'row', marginBottom: 6 },
  weekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 0.6,
    color: color.neutral[600],
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, padding: 3 },
  dayInner: {
    flex: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayInWindow: { backgroundColor: color.acc2[200] },
  dayEndpoint: { backgroundColor: color.accent },
  daySelected: { borderWidth: 2, borderColor: color.acc2[700] },
  dayText: { fontFamily: font.body, fontSize: 13, color: color.text },
  dayEndpointText: { color: color.bg, fontFamily: font.bodySemi },

  field: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 10,
  },
  input: {
    fontFamily: font.heading,
    fontSize: 20,
    color: color.text,
    paddingVertical: 2,
  },

  photoSlot: {
    height: 88,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.neutral[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  photoSlotText: {
    fontFamily: font.body,
    fontSize: 13,
    color: color.neutral[700],
  },
  photoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: color.neutral[200],
  },
  thumb: { width: '100%', height: '100%' },
  thumbX: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(245,234,216,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbAdd: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: color.neutral[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
