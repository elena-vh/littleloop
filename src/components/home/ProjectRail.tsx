import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { color, font, radius } from '@src/theme/theme';
import type { Project } from '@src/db/projectsRepo';
import { useProgress, projectPercent } from '@src/store/progress';

const CARD_W = 150;

const TINTS: [string, string][] = [
  [color.acc2[300], color.acc2[800]],
  [color.acc[200], color.acc[800]],
  [color.neutral[300], color.neutral[700]],
  [color.acc2[200], color.acc2[700]],
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
  const [block, ink] = TINTS[index % TINTS.length];
  const photo = project.photos?.[0]?.uri;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: block }]}>
          <Text style={[styles.monogram, { color: ink }]}>
            {project.name.trim().charAt(0).toUpperCase() || '·'}
          </Text>
        </View>
      )}
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
          <Plus size={19} strokeWidth={2.75} color={color.acc[800]} />
        </Pressable>
      </View>

      {projects.length === 0 ? (
        <Pressable style={styles.empty} onPress={onAdd}>
          <Text style={styles.emptyMonogram}>+</Text>
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
    marginBottom: 14,
  },
  heading: { fontFamily: font.heading, fontSize: 17, color: color.text },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: { gap: 14, paddingRight: 4 },
  card: { width: CARD_W },
  thumb: {
    height: 116,
    borderRadius: radius.photo,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  monogram: {
    fontFamily: font.headingBlack,
    fontSize: 52,
    opacity: 0.65,
  },
  name: {
    fontFamily: font.heading,
    fontSize: 14,
    color: color.text,
    marginTop: 10,
    marginBottom: 7,
  },
  track: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: color.neutral[300],
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[600],
  },
  empty: {
    borderRadius: radius.photo,
    height: 116,
    borderWidth: 1.5,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyMonogram: {
    fontFamily: font.headingBlack,
    fontSize: 34,
    color: color.neutral[500],
  },
  emptyText: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[600],
  },
});
