import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { ChevronLeft, MoreVertical, Plus, Minus } from 'lucide-react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius, HIT } from '@src/theme/theme';
import { useYarn } from '@src/store/yarn';
import { listProjects, type Project } from '@src/db/projectsRepo';
import StitchTexture from '@src/components/ui/StitchTexture';

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.spec}>
      <Text style={styles.kicker}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

export default function YarnDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const yarn = useYarn((s) => s.yarns.find((y) => y.id === id));
  const adjustSkeins = useYarn((s) => s.adjustSkeins);

  const [usedIn, setUsedIn] = useState<Project[]>([]);
  useFocusEffect(
    useCallback(() => {
      setUsedIn(listProjects().filter((p) => p.yarnId === id));
    }, [id])
  );

  if (!yarn) {
    return (
      <View style={styles.root}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { marginTop: insets.top + 12, marginLeft: 20 }]}>
          <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
        </Pressable>
        <Text style={styles.missing}>Yarn not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 56, paddingBottom: 28 + insets.bottom },
        ]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.iconBtn}
            hitSlop={8}>
            <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {yarn.brand}
          </Text>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <MoreVertical size={20} strokeWidth={2.75} color={color.text} />
          </Pressable>
        </View>

        <View style={styles.panel}>
          <View style={[styles.ball, { backgroundColor: yarn.swatch }]}>
            <View style={styles.ballSheen} />
          </View>
        </View>

        <Text style={styles.colorway}>{yarn.colorway}</Text>
        <Text style={styles.metaLine}>
          {[
            yarn.dyeLot ? `Dye lot ${yarn.dyeLot}` : null,
            yarn.boughtAt ? `bought ${yarn.boughtAt}` : null,
          ]
            .filter(Boolean)
            .join(' · ') || yarn.brand}
        </Text>

        <View style={styles.grid}>
          <Spec label='Weight' value={yarn.weight} />
          <Spec label='Fibre' value={yarn.fiber ?? '—'} />
          <Spec label='Yardage' value={yarn.yardage ?? '—'} />
          <Spec label='Needle' value={yarn.needle ?? '—'} />
        </View>

        <View style={styles.stepper}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stepperLabel}>Skeins left</Text>
            <Text style={styles.stepperCount}>{yarn.skeins}</Text>
          </View>
          <Pressable
            style={styles.stepMinus}
            onPress={() => adjustSkeins(yarn.id, -1)}
            accessibilityLabel='One fewer skein'>
            <Minus size={22} strokeWidth={2.75} color={color.acc2[900]} />
          </Pressable>
          <Pressable
            style={styles.stepPlus}
            onPress={() => adjustSkeins(yarn.id, 1)}
            accessibilityLabel='One more skein'>
            <Plus size={22} strokeWidth={2.75} color={color.bg} />
          </Pressable>
        </View>

        <Text style={styles.h4}>Used in</Text>
        {usedIn.length === 0 ? (
          <Text style={styles.emptyUsed}>Not used in a project yet.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {usedIn.map((p, i) => (
              <Pressable
                key={p.id}
                style={styles.usedRow}
                onPress={() =>
                  router.push({ pathname: '/projects/[id]', params: { id: p.id } })
                }>
                <StitchTexture
                  from={i % 2 ? color.acc[300] : color.neutral[800]}
                  to={i % 2 ? color.acc[100] : color.neutral[200]}
                  band={6}
                  style={styles.usedThumb}
                />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.usedName} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.usedSub} numberOfLines={1}>
                    {p.craft}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingHorizontal: 20 },
  missing: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.neutral[700],
    padding: 24,
  },

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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 16,
    color: color.text,
  },

  panel: {
    height: 150,
    borderRadius: radius.cardLg,
    backgroundColor: color.neutral[800],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  ball: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(32,30,29,0.25)',
    overflow: 'hidden',
  },
  ballSheen: {
    position: 'absolute',
    top: 10,
    left: 14,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(245,234,216,0.28)',
  },

  colorway: {
    fontFamily: font.heading,
    fontSize: 24,
    color: color.text,
    marginBottom: 2,
  },
  metaLine: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
    marginBottom: 18,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginBottom: 18,
  },
  spec: {
    width: '48.5%',
    backgroundColor: color.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 5,
  },
  specValue: { fontFamily: font.body, fontSize: 13.5, color: color.text },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: color.acc2[200],
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  stepperLabel: {
    fontFamily: font.body,
    fontSize: 11,
    color: color.acc2[900],
  },
  stepperCount: {
    fontFamily: font.heading,
    fontSize: 30,
    lineHeight: 34,
    color: color.acc2[900],
  },
  stepMinus: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: color.acc2[700],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPlus: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[700],
    alignItems: 'center',
    justifyContent: 'center',
  },

  h4: {
    fontFamily: font.heading,
    fontSize: 18,
    color: color.text,
    marginBottom: 10,
  },
  emptyUsed: {
    fontFamily: font.body,
    fontSize: 13.5,
    color: color.neutral[700],
  },
  usedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: color.surface,
    borderRadius: 14,
    padding: 12,
  },
  usedThumb: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  usedName: { fontFamily: font.body, fontSize: 13.5, color: color.text },
  usedSub: {
    fontFamily: font.body,
    fontSize: 11.5,
    color: color.neutral[700],
    marginTop: 2,
    textTransform: 'capitalize',
  },
});
