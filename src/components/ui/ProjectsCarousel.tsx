import { Project } from '@src/db/projectsRepo';
import React, { useMemo, useRef } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  Pressable,
  Text,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

// Tune these to match your design
const CARD_WIDTH = Math.round(SCREEN_W * 0.62);
const CARD_ASPECT_RATIO = 1.3; // width : height
const CARD_HEIGHT = Math.round(CARD_WIDTH / CARD_ASPECT_RATIO);
const CARD_GAP = 14;
const SNAP = CARD_WIDTH + CARD_GAP;
const SIDE_PADDING = 20;

export function ProjectsCarousel({
  data,
  onPressItem,
}: {
  data: Project[];
  onPressItem?: (item: Project) => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;

  const contentInsetStyle = useMemo(
    () => ({ paddingHorizontal: SIDE_PADDING }),
    []
  );
  return (
    <Animated.FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      decelerationRate='fast'
      snapToInterval={SNAP}
      snapToAlignment='start'
      contentContainerStyle={[styles.listContent, contentInsetStyle]}
      ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        const inputRange = [
          (index - 1) * SNAP,
          index * SNAP,
          (index + 1) * SNAP,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.92, 1.0, 0.92],
          extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
          inputRange,
          outputRange: [10, 0, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.85, 1, 0.85],
          extrapolate: 'clamp',
        });
        console.log({ item });

        return (
          <Animated.View
            style={[
              styles.cardWrap,
              { transform: [{ scale }, { translateY }], opacity },
            ]}>
            <Pressable onPress={() => onPressItem?.(item)} style={styles.card}>
              <Image
                source={{ uri: item.photos[0]?.uri }}
                style={styles.image}
              />
              {!!item.name && (
                <View style={styles.titlePill}>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 8,
  },
  cardWrap: {
    width: CARD_WIDTH,
  },
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#111',
    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    // shadow (Android)
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  titlePill: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  titleText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    maxWidth: CARD_WIDTH - 24,
  },
});
