import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Use your existing PhotoRef type
// type PhotoRef = { id: string; uri: string; ... }

import PlusIcon from '@assets/icons/plus.svg';
import EditIcon from '@assets/icons/edit.svg';
import { ProgressPic } from '@src/db/progressPicsRepo';

export function ProgressPicsSection({
  photos,
  onAddPress,
  onEditPress,
}: {
  photos: ProgressPic[];
  onAddPress: () => void;
  onEditPress: (photoId: string) => void;
}) {
  if (!photos?.length) {
    return (
      <View style={pp.section}>
        <View style={pp.header}>
          <Text style={pp.title}>Progress pics</Text>
          <Pressable onPress={onAddPress} hitSlop={10} style={pp.iconBtn}>
            <PlusIcon width={22} height={22} />
          </Pressable>
        </View>

        <Text style={pp.emptyText}>
          No progress pics yet. Add one to track your project visually.
        </Text>
      </View>
    );
  }

  return (
    <View style={pp.section}>
      <View style={pp.header}>
        <Text style={pp.title}>Progress pics</Text>
        <Pressable onPress={onAddPress} hitSlop={10} style={pp.iconBtn}>
          <PlusIcon width={22} height={22} />
        </Pressable>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={pp.col}
        contentContainerStyle={pp.grid}
        renderItem={({ item }) => (
          <ProgressPicCard
            photo={item.photo}
            onEdit={() => onEditPress(item.id)}
          />
        )}
      />
    </View>
  );
}

function ProgressPicCard({
  photo,
  onEdit,
}: {
  photo: { id: string; uri: string };
  onEdit: () => void;
}) {
  const dateLabel = formatPhotoDateFromId(photo.id);

  return (
    <View style={pp.card}>
      <View style={pp.imageWrap}>
        <Image source={{ uri: photo.uri }} style={pp.image} />

        <Pressable onPress={onEdit} hitSlop={10} style={pp.editBtn}>
          <EditIcon width={20} height={20} />
        </Pressable>
      </View>

      <Text style={pp.date}>{dateLabel}</Text>

      {/* You don't have captions in DB yet; keep this ready for later */}
      <Text style={pp.caption} numberOfLines={2}>
        {/* later: photo.note */}
        This is my progress in the first 17 days…{' '}
        <Text style={pp.seeMore}>See more</Text>
      </Text>
    </View>
  );
}

/**
 * Your photo ids look like: "1769587662009_3c38a38233b6e"
 * If the prefix is an epoch ms timestamp, we format it like "17 Sep 2025".
 */
function formatPhotoDateFromId(id: string) {
  const prefix = id.split('_')[0];
  const ms = Number(prefix);

  if (!Number.isFinite(ms) || ms < 1000000000) {
    // fallback: today-ish label; you could also return ""
    return new Date().toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return new Date(ms).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const pp = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 18,
    color: '#111827',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontFamily: 'Quicksand_500Medium',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
  },

  grid: {
    paddingBottom: 6,
  },
  col: {
    gap: 14,
  },
  card: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  imageWrap: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
  },
  editBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  date: {
    marginTop: 12,
    fontFamily: 'Quicksand_700Bold',
    fontSize: 20,
    color: '#6B7280',
  },
  caption: {
    marginTop: 8,
    fontFamily: 'Quicksand_500Medium',
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  seeMore: {
    color: '#F87171', // soft red like your screenshot "See more"
    fontFamily: 'Quicksand_700Bold',
  },
});
