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
    }, [])
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

        <Text style={styles.greeting}>
          {line1}
          {!!line2 && `\n${line2}`}
        </Text>

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
  greeting: {
    fontFamily: font.heading,
    fontSize: 30,
    lineHeight: 34,
    color: color.text,
    marginTop: 6,
    marginBottom: 22,
  },
  block: { marginTop: 26 },
});
