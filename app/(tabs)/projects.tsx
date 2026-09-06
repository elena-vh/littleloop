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
import { Search, SlidersHorizontal, Plus, Heart } from 'lucide-react-native';
import { useFocusEffect, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { listProjects, type Project } from '@src/db/projectsRepo';
import { useProgress, projectPercent } from '@src/store/progress';
import StitchTexture from '@src/components/ui/StitchTexture';
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
  const pct = Math.round(projectPercent(counters, project.id) * 100);
  const photo = project.photos?.[0]?.uri;
  const [from, to] = TINTS[index % TINTS.length];
  const tags = [project.craft, ...(project.tags ?? [])].filter(Boolean).slice(0, 2);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.thumb}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <StitchTexture from={from} to={to} band={9} style={StyleSheet.absoluteFill} />
        )}
        <View style={styles.heart}>
          <Heart size={17} strokeWidth={2.75} color={color.neutral[500]} />
        </View>
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
            <StitchTexture
              from={color.acc2[300]}
              to={color.acc2[100]}
              band={9}
              style={styles.emptyThumb}
            />
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptySub}>Cast on your first project</Text>
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
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: color.neutral[200],
  },
  photo: {
    ...StyleSheet.absoluteFill,
    resizeMode: 'cover',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(245,234,216,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[700],
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
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 44,
    borderRadius: 26,
    overflow: 'hidden',
  },
  emptyThumb: { ...StyleSheet.absoluteFill },
  emptyTitle: {
    fontFamily: font.heading,
    fontSize: 18,
    color: color.text,
    backgroundColor: color.bg,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    overflow: 'hidden',
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
