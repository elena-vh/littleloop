import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font } from '@src/theme/theme';
import { usePrefs } from '@src/store/prefs';
import { useGreetingParts } from '@src/hooks/useGreeting';
import { listProjects, type Project } from '@src/db/projectsRepo';
import { getGlobalStreakDays } from '@src/db/sessionsRepo';

import StreakChip from '@src/components/home/StreakChip';
import ContinueCard from '@src/components/home/ContinueCard';
import ProjectRail from '@src/components/home/ProjectRail';
import TodayTasks from '@src/components/home/TodayTasks';
import CraftPickerModal from '@src/components/home/CraftPickerModal';

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Home() {
  const insets = useSafeAreaInsets();
  const name = usePrefs((s) => s.name);
  const { line1, line2 } = useGreetingParts(name);

  const [projects, setProjects] = useState<Project[]>([]);
  const [streak, setStreak] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setProjects(listProjects());
      setStreak(getGlobalStreakDays(TZ));
    }, []),
  );

  const current = projects[0];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}>
        <StreakChip count={streak} onPress={() => router.push('/profile')} />

        <View style={styles.greetingWrap}>
          <Text style={styles.greetingLine1}>{line1}</Text>
          {!!line2 && <Text style={styles.greetingLine2}>{line2}</Text>}
        </View>

        {current && (
          <View style={styles.block}>
            <ContinueCard
              project={current}
              onPress={() => router.push(`/projects/${current.id}`)}
            />
          </View>
        )}

        <View style={styles.block}>
          <ProjectRail
            projects={projects}
            onPressProject={(p) => router.push(`/projects/${p.id}`)}
            onAdd={() => setPickerOpen(true)}
          />
        </View>

        <View style={styles.block}>
          <TodayTasks />
        </View>
      </ScrollView>

      <CraftPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: {
    paddingTop: 64,
    paddingHorizontal: 22,
  },
  greetingWrap: { marginTop: 10, marginBottom: 24 },
  greetingLine1: {
    fontFamily: font.serif,
    fontSize: 16,
    color: color.neutral[700],
  },
  greetingLine2: {
    fontFamily: font.headingBlack,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: color.text,
    marginTop: 2,
  },
  block: { marginTop: 30 },
});
