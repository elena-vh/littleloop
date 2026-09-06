import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { ChevronLeft, FileText } from 'lucide-react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius, HIT } from '@src/theme/theme';
import { getProjectById, type Project } from '@src/db/projectsRepo';
import { useProgress, PRIMARY_COUNTER } from '@src/store/progress';
import { surroundingRows, REPEAT_LEN, repeatInfo } from '@src/lib/pattern';
import Tag from '@src/components/ui/Tag';

const SIZES = [-1, 0, 1]; // Aa cycle: small / medium / large
const SIZE_LABEL = ['A', 'Aa', 'AA'];

export default function PatternScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getProjectById(id).then((p) => alive && setProject(p));
      return () => {
        alive = false;
      };
    }, [id])
  );

  const counter = useProgress((s) => s.counters[id]?.[PRIMARY_COUNTER]);
  const row = counter?.current ?? 0;
  const total = counter?.total || 250;

  const [source, setSource] = useState<'typed' | 'pdf'>('typed');
  const [sizeStep, setSizeStep] = useState(0);
  const bump = SIZES[sizeStep];

  const rows = surroundingRows(row, total);
  const { repeatsTotal, repeatIdx } = repeatInfo(row, total);
  const repeatsToGo = Math.max(0, repeatsTotal - repeatIdx);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
        ]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}>
            <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
          <Text style={styles.title} numberOfLines={1}>
            {project?.patternFile?.name?.replace(/\.[^.]+$/, '') ??
              project?.name ??
              'Pattern'}
          </Text>
          <Pressable
            onPress={() => setSizeStep((s) => (s + 1) % SIZES.length)}
            style={styles.iconBtn}
            hitSlop={8}
            accessibilityLabel='Text size'>
            <Text style={styles.aa}>{SIZE_LABEL[sizeStep]}</Text>
          </Pressable>
        </View>

        <View style={styles.tabs}>
          <Pressable onPress={() => setSource('typed')}>
            <Tag
              label='Typed rows'
              variant={source === 'typed' ? 'solid' : 'neutral'}
              size={12.5}
            />
          </Pressable>
          <Pressable onPress={() => setSource('pdf')}>
            <Tag
              label='PDF'
              variant={source === 'pdf' ? 'solid' : 'neutral'}
              size={12.5}
            />
          </Pressable>
        </View>

        {source === 'typed' ? (
          <View style={styles.rows}>
            {rows.map((r) => (
              <View
                key={r.n}
                style={[styles.rowLine, r.current && styles.rowCurrent]}>
                <Text
                  style={[
                    styles.rowNum,
                    { fontSize: 12.5 + bump },
                    r.current && styles.rowNumCurrent,
                  ]}>
                  {r.n}
                </Text>
                <Text
                  style={[
                    styles.rowText,
                    { fontSize: 14.5 + bump, lineHeight: 21 + bump },
                    r.current && styles.rowTextCurrent,
                  ]}>
                  {r.text}
                </Text>
              </View>
            ))}
            <View style={styles.rowLine}>
              <Text style={[styles.rowNum, { fontSize: 12.5 + bump }]}>·</Text>
              <Text style={[styles.rowText, { fontSize: 14.5 + bump }]}>
                Stripe repeat continues to row {total} — {repeatsToGo} repeats to
                go.
              </Text>
            </View>
          </View>
        ) : (
          <Pressable style={styles.pdfCard}>
            <View style={styles.pdfIcon}>
              <FileText size={22} strokeWidth={2.75} color={color.acc[800]} />
            </View>
            <Text style={styles.pdfName} numberOfLines={1}>
              {project?.patternFile?.name ??
                project?.patternLink ??
                'No PDF attached'}
            </Text>
            <Text style={styles.pdfSub}>
              {project?.patternFile
                ? 'Tap to open the attached file'
                : project?.patternLink
                ? 'Opens the linked pattern'
                : 'Attach a PDF from project settings'}
            </Text>
          </Pressable>
        )}

        <View style={styles.notes}>
          <Text style={styles.notesKicker}>Notes</Text>
          <Text style={styles.notesBody}>
            Stripes read cleaner if the colour change happens on a knit row.
            Carry the cream loosely up the side. Repeat is {REPEAT_LEN} rows.
          </Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backBtn,
            pressed && styles.backBtnPressed,
          ]}>
          <Text style={styles.backBtnText}>Back to counter</Text>
        </Pressable>
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
    marginBottom: 18,
  },
  iconBtn: {
    width: HIT,
    height: HIT,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 16,
    color: color.text,
  },
  aa: { fontFamily: font.heading, fontSize: 15, color: color.text },

  tabs: { flexDirection: 'row', gap: 8, marginBottom: 18 },

  rows: { gap: 2 },
  rowLine: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  rowCurrent: { backgroundColor: color.acc[100], borderRadius: 22 },
  rowNum: {
    width: 38,
    fontFamily: font.body,
    color: color.neutral[600],
  },
  rowNumCurrent: { fontFamily: font.heading, fontSize: 15, color: color.acc[800] },
  rowText: {
    flex: 1,
    fontFamily: font.body,
    color: color.neutral[700],
  },
  rowTextCurrent: {
    fontFamily: font.bodySemi,
    color: color.acc[900],
  },

  pdfCard: {
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 18,
    alignItems: 'flex-start',
    gap: 8,
  },
  pdfIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: color.acc[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfName: { fontFamily: font.heading, fontSize: 15, color: color.text },
  pdfSub: { fontFamily: font.body, fontSize: 12.5, color: color.neutral[700] },

  notes: {
    backgroundColor: color.acc2[200],
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 20,
  },
  notesKicker: {
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: color.acc2[800],
    marginBottom: 6,
  },
  notesBody: {
    fontFamily: font.body,
    fontSize: 14,
    lineHeight: 21,
    color: color.acc2[900],
  },

  backBtn: {
    marginTop: 18,
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: { backgroundColor: color.acc[600] },
  backBtnText: { fontFamily: font.bodySemi, fontSize: 15, color: color.bg },
});
