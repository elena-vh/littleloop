import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { Search, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { useYarn, isLow, type Yarn } from '@src/store/yarn';
import YarnSwatch from '@src/components/ui/YarnSwatch';
import Tag from '@src/components/ui/Tag';

function YarnRow({ yarn, onPress }: { yarn: Yarn; onPress: () => void }) {
  const low = isLow(yarn);
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <YarnSwatch color={yarn.swatch} size={46} />
      <View style={styles.rowMid}>
        <Text style={styles.brand} numberOfLines={1}>
          {yarn.brand}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {yarn.colorway} · {yarn.weight} · {yarn.skeins}{' '}
          {low ? 'skeins left' : `skein${yarn.skeins === 1 ? '' : 's'}`}
        </Text>
      </View>
      {low ? (
        <Tag label='low' variant='accent' />
      ) : (
        <ChevronRight size={18} strokeWidth={2.75} color={color.neutral[600]} />
      )}
    </Pressable>
  );
}

export default function YarnStashScreen() {
  const insets = useSafeAreaInsets();
  const yarns = useYarn((s) => s.yarns);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return yarns;
    return yarns.filter(
      (y) =>
        y.brand.toLowerCase().includes(q) ||
        y.colorway.toLowerCase().includes(q)
    );
  }, [yarns, query]);

  const totals = useMemo(() => {
    const skeins = yarns.reduce((n, y) => n + y.skeins, 0);
    const colourways = new Set(yarns.map((y) => y.colorway)).size;
    const lowCount = yarns.filter(isLow).length;
    return { skeins, colourways, lowCount };
  }, [yarns]);

  return (
    <View style={styles.root}>
      <FlatList
        data={filtered}
        keyExtractor={(y) => y.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + insets.bottom + 60 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Yarn stash</Text>
            <Text style={styles.sub}>
              {totals.skeins} skeins · {totals.colourways} colourways
              {totals.lowCount > 0 ? ` · ${totals.lowCount} running low` : ''}
            </Text>
            <View style={styles.searchBox}>
              <Search
                size={18}
                strokeWidth={2.75}
                color={color.neutral[700]}
              />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder='Search by brand or colour'
                placeholderTextColor={color.neutral[600]}
                style={styles.searchInput}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <YarnRow
            yarn={item}
            onPress={() =>
              router.push({ pathname: '/yarn/[id]', params: { id: item.id } })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query ? 'No matches.' : 'Your stash is empty.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  content: { paddingTop: 64, paddingHorizontal: 22 },
  title: {
    fontFamily: font.heading,
    fontSize: 30,
    lineHeight: 34,
    color: color.text,
  },
  sub: {
    fontFamily: font.body,
    fontSize: 12.5,
    color: color.neutral[700],
    marginTop: 4,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 14.5,
    color: color.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 72,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.card,
    backgroundColor: color.surface,
  },
  rowMid: { flex: 1, minWidth: 0 },
  brand: { fontFamily: font.heading, fontSize: 15, color: color.text },
  meta: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.neutral[700],
    marginTop: 2,
  },
  empty: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.neutral[600],
    marginTop: 20,
  },
});
