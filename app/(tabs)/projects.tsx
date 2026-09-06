import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Search, SlidersHorizontal, Plus } from 'lucide-react-native';
import { useFocusEffect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { listProjects, type Project } from '@src/db/projectsRepo';
import { useProgress, projectPercent } from '@src/store/progress';
import Tag from '@src/components/ui/Tag';
import CraftPickerModal from '@src/components/home/CraftPickerModal';

type Filter = 'all' | 'knitting' | 'crochet' | 'gifts';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'knitting', label: 'Knit' },
  { key: 'crochet', label: 'Crochet' },
  { key: 'gifts', label: 'Gifts' },
];

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
  const pct = Math.round(projectPercent(counters, project.id) * 100);
  const photo = project.photos?.[0]?.uri;
  const [block, ink] = TINTS[index % TINTS.length];
  const tags = [project.craft, ...(project.tags ?? [])].filter(Boolean).slice(0, 2);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.block, { backgroundColor: block }]}>
            <Text style={[styles.monogram, { color: ink }]}>
              {project.name.trim().charAt(0).toUpperCase() || '·'}
            </Text>
          </View>
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pct}%</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {project.name}
      </Text>
      <View style={styles.tags}>
        {tags.map((t, i) => (
          <Tag
            key={`${t}-${i}`}
            label={String(t)}
            variant={i === 0 ? 'accent2' : 'neutral'}
          />
        ))}
      </View>
    </Pressable>
  );
}

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [pickerOpen, setPickerOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setProjects(listProjects());
    }, [])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filter === 'all') return true;
      if (filter === 'gifts')
        return (p.tags ?? []).some((t) => t.toLowerCase().includes('gift'));
      return p.craft === filter;
    });
  }, [projects, query, filter]);

  const count = projects.length;

  return (
    <View style={styles.root}>
      <View style={[styles.head, { paddingTop: 64 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Projects</Text>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={styles.addBtn}
            accessibilityLabel='Add project'>
            <Plus size={20} strokeWidth={2.75} color={color.acc[800]} />
          </Pressable>
        </View>
        <Text style={styles.count}>
          {count} {count === 1 ? 'project' : 'on the needles'}
        </Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Search size={18} strokeWidth={2.75} color={color.neutral[700]} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder='Search projects'
              placeholderTextColor={color.neutral[600]}
              style={styles.searchInput}
              returnKeyType='search'
            />
          </View>
          <Pressable style={styles.filterBtn} accessibilityLabel='Filter'>
            <SlidersHorizontal
              size={20}
              strokeWidth={2.75}
              color={color.neutral[700]}
            />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable key={f.key} onPress={() => setFilter(f.key)}>
                <Tag
                  label={f.label}
                  variant={active ? 'solid' : 'neutral'}
                  size={12.5}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 28 + insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ProjectCard
            project={item}
            index={index}
            onPress={() => router.push(`/projects/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Pressable style={styles.empty} onPress={() => setPickerOpen(true)}>
            <Text style={styles.emptyTitle}>Nothing on the needles</Text>
            <Text style={styles.emptySub}>Tap to cast on your first project</Text>
          </Pressable>
        }
      />

      <CraftPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  head: { paddingHorizontal: 22 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: font.heading,
    fontSize: 30,
    lineHeight: 34,
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
  count: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
    marginTop: 4,
    marginBottom: 18,
  },
  searchRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  searchBox: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 14.5,
    color: color.text,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: { gap: 8, paddingBottom: 20, paddingRight: 22 },
  list: { paddingHorizontal: 22, paddingTop: 4 },
  column: { gap: 16, marginBottom: 16 },
  card: { flex: 1 },
  thumb: {
    height: 150,
    borderRadius: radius.photo,
    overflow: 'hidden',
    backgroundColor: color.neutral[200],
  },
  photo: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
  },
  block: { alignItems: 'center', justifyContent: 'center' },
  monogram: {
    fontFamily: font.headingBlack,
    fontSize: 64,
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.sm,
    backgroundColor: color.acc2[800],
  },
  badgeText: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    color: color.bg,
  },
  name: {
    fontFamily: font.heading,
    fontSize: 15,
    lineHeight: 18,
    color: color.text,
    marginTop: 10,
    marginBottom: 7,
  },
  tags: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  empty: {
    marginTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontFamily: font.heading,
    fontSize: 20,
    color: color.text,
  },
  emptySub: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.acc2[900],
    marginTop: 6,
    backgroundColor: color.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
