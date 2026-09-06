// app/(tabs)/projects.tsx
import React, { useCallback, useMemo, useState } from 'react';
import HeaderShape from '@assets/header.svg';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@src/theme/tokens';

const TAB_BAR_HEIGHT = 80;

import { listProjects } from '@src/db/projectsRepo';
import type { Project } from '@src/db/projectsRepo';
import NoProjects from '@app/screens/Projects/NoProjects';

type UiProject = {
  id: string;
  title: string;
  imageUrl?: string;
  chips: string[];
};

function getFirstPhotoUri(photos: any[] | undefined) {
  const first = photos?.[0];
  return (
    first?.uri ?? first?.localUri ?? first?.path ?? first?.url ?? undefined
  );
}

function craftToLabel(craft: any) {
  if (!craft) return '';
  if (typeof craft === 'string') return craft;
  return craft?.name ?? String(craft);
}

function mapDbToUi(p: Project): UiProject {
  const chips = [craftToLabel(p.craft), ...(p.tags ?? [])]
    .filter(Boolean)
    .slice(0, 3);

  return {
    id: p.id,
    title: p.name ?? 'Untitled',
    imageUrl: getFirstPhotoUri(p.photos),
    chips,
  };
}

export default function ProjectsScreen() {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const rows = await listProjects(); // ✅ sqlite
      setProjects((rows ?? []).map(mapDbToUi));
    } catch (e: any) {
      console.log('listProjects failed:', e);
      setErrorMsg('Couldn’t load projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [loadProjects])
  );
  console.log(projects);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.title.toLowerCase().includes(q));
  }, [projects, query]);

  const onPressProject = (p: UiProject) => {
    // TODO: route to project details
    console.log('open project', p.id);
    // router.push(`/projects/${p.id}`);
  };

  const onPressFilter = () => {
    console.log('filter');
  };

  const onPressAdd = () => {
    console.log('add project');
    // router.push("/projects/new");
  };

  return (
    <>
      {projects.length === 0 ? (
        <NoProjects />
      ) : (
        <View style={styles.screen}>
          {/* soft background blocks */}
          <HeaderShape
            width='100%'
            height={240}
            style={[styles.bgTop, { top: -50 }]}
            preserveAspectRatio='xMidYMid slice'
          />
          {/* Title */}
          <View style={styles.header}>
            <Text style={styles.title}>Projects</Text>
          </View>

          {/* Main surface */}
          <View style={styles.surface}>
            {/* Search + filter */}
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name='search' size={18} color='rgba(0,0,0,0.45)' />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder='Search projects'
                  placeholderTextColor='rgba(0,0,0,0.35)'
                  style={styles.searchInput}
                  returnKeyType='search'
                />
              </View>

              <Pressable
                onPress={onPressFilter}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.filterButton,
                  pressed && styles.pressed,
                ]}>
                <Ionicons name='filter' size={18} color='rgba(0,0,0,0.75)' />
              </Pressable>
            </View>

            {/* Grid */}
            {loading ? (
              <View style={styles.center}>
                <ActivityIndicator />
              </View>
            ) : errorMsg ? (
              <View style={styles.center}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <Pressable
                  onPress={loadProjects}
                  style={({ pressed }) => [
                    styles.retry,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.column}
                contentContainerStyle={[
                  styles.listContent,
                  { paddingBottom: TAB_BAR_HEIGHT + insets.bottom },
                ]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <ProjectCard
                    project={item}
                    onPress={() => onPressProject(item)}
                  />
                )}
                ListEmptyComponent={
                  <View style={styles.center}>
                    <Text style={styles.emptyTitle}>No projects yet</Text>
                    <Text style={styles.emptySub}>
                      Tap + to add your first one.
                    </Text>
                  </View>
                }
              />
            )}
          </View>

          {/* FAB */}
          <Pressable
            onPress={onPressAdd}
            hitSlop={10}
            style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}>
            <Ionicons name='add' size={30} color='#fff' />
          </Pressable>
        </View>
      )}
    </>
  );
}

function ProjectCard({
  project,
  onPress,
}: {
  project: UiProject;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.imageWrap}>
        {project.imageUrl ? (
          <Image source={{ uri: project.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}

        <View pointerEvents='none' style={styles.heartGhost}>
          <Ionicons
            name='heart-outline'
            size={18}
            color='rgba(255,255,255,0.85)'
          />
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {project.title}
        </Text>

        <View style={styles.chipsRow}>
          {project.chips.slice(0, 2).map((t) => (
            <View key={t} style={styles.chip}>
              <Text numberOfLines={1} style={styles.chipText}>
                {t}
              </Text>
            </View>
          ))}
          {project.chips.length > 2 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                +{project.chips.length - 2}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const GAP = 8;
const PAD = 16;
const { width: W } = Dimensions.get('window');
const CARD_W = (W - PAD * 2 - GAP) / 2;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF' },

  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bgBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 280,
    backgroundColor: '#EFEAD5',
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: PAD,
    paddingBottom: 10,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    color: '#111',
    fontFamily: 'Fraunces_600SemiBold',
  },

  surface: {
    flex: 1,
    paddingHorizontal: PAD,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 60,
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#111',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContent: { paddingBottom: 20 },
  column: { gap: GAP, marginBottom: GAP },

  card: {
    width: CARD_W,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  cardPressed: { transform: [{ scale: 0.99 }], opacity: 0.96 },

  imageWrap: {
    height: 120,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  image: { width: '100%', height: '100%', borderRadius: 20 },
  imagePlaceholder: {
    width: '100%',
    borderRadius: 20,
    height: '100%',
  },

  heartGhost: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardBody: { padding: 12, gap: 8 },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Mulish_600SemiBold',
    color: '#111',
  },

  chipsRow: { flexDirection: 'row', gap: 6, flexWrap: 'nowrap' },
  chip: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Mulish_400Regular',
    color: 'rgba(0,0,0,0.5)',
  },

  fab: {
    position: 'absolute',
    right: 22,
    bottom: 34,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 8 },
      default: {},
    }),
  },
  fabPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },

  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  emptySub: { fontSize: 13, fontWeight: '600', color: 'rgba(0,0,0,0.5)' },

  errorText: { fontSize: 13, fontWeight: '700', color: 'rgba(0,0,0,0.55)' },
  retry: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: { fontSize: 13, fontWeight: '800', color: '#111' },
});
