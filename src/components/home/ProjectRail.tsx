import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { color, font, radius } from '@src/theme/theme';
import StitchTexture from '@src/components/ui/StitchTexture';
import type { Project } from '@src/db/projectsRepo';
import { useProgress, projectPercent } from '@src/store/progress';

const CARD_W = 148;

const TINTS: [string, string][] = [
  [color.neutral[800], color.neutral[200]],
  [color.acc[300], color.acc[100]],
  [color.acc2[400], color.acc2[100]],
  [color.acc[200], color.neutral[100]],
];

function ProjectCard({
  project,
  index,
  onPress,
}: {
  project: Project;
  index: number;
  onPress: () => void;
}) {
  const counters = useProgress((s) => s.counters);
  const pct = projectPercent(counters, project.id);
  const [from, to] = TINTS[index % TINTS.length];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <StitchTexture from={from} to={to} band={9} style={styles.thumb} />
      <Text style={styles.name} numberOfLines={1}>
        {project.name}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
      </View>
    </Pressable>
  );
}

export default function ProjectRail({
  projects,
  onPressProject,
  onAdd,
}: {
  projects: Project[];
  onPressProject: (p: Project) => void;
  onAdd: () => void;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Current projects</Text>
        <Pressable
          onPress={onAdd}
          style={styles.addBtn}
          accessibilityRole='button'
          accessibilityLabel='Add project'>
          <Plus size={20} strokeWidth={2.75} color={color.acc[800]} />
        </Pressable>
      </View>

      {projects.length === 0 ? (
        <Pressable style={styles.empty} onPress={onAdd}>
          <StitchTexture
            from={color.acc2[300]}
            to={color.acc2[100]}
            band={9}
            style={styles.emptyThumb}
          />
          <Text style={styles.emptyText}>Cast on your first project</Text>
        </Pressable>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}>
          {projects.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onPress={() => onPressProject(p)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heading: {
    fontFamily: font.heading,
    fontSize: 19,
    color: color.text,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.acc[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: { gap: 12, paddingRight: 4 },
  card: { width: CARD_W },
  thumb: {
    height: 112,
    borderRadius: 24,
    backgroundColor: color.neutral[200],
  },
  name: {
    fontFamily: font.heading,
    fontSize: 14,
    color: color.text,
    marginTop: 9,
    marginBottom: 6,
  },
  track: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: color.neutral[300],
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[600],
  },
  empty: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyThumb: { ...StyleSheet.absoluteFill, borderRadius: 24 },
  emptyText: {
    fontFamily: font.bodySemi,
    fontSize: 13,
    color: color.acc2[900],
    backgroundColor: color.bg,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
