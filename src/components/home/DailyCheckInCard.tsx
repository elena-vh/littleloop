import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@src/theme/tokens';

type Props = {
  greeting?: string; // "good afternoon."
  streakCount?: number; // 1
  selectedDayLabel?: string; // "Mo"
  week?: { label: string; date?: string }[]; // [{label:"Mo",date:"27"}, ...]
  checkedInToday?: boolean;
  onPressBegin?: () => void;
  onPressProfile?: () => void;
  onPressStreak?: () => void;
  style?: ViewStyle;
};

export function DailyCheckInMinimalCard({
  greeting = 'Good day.',
  streakCount = 1,
  selectedDayLabel = 'Mo',
  week,
  checkedInToday = true,
  onPressBegin,
  onPressProfile,
  onPressStreak,
  style,
}: Props) {
  const days = useMemo(() => {
    return (
      week ?? [
        { label: 'Mo', date: '27' },
        { label: 'Tu', date: '28' },
        { label: 'We', date: '29' },
        { label: 'Th', date: '30' },
        { label: 'Fr', date: '31' },
        { label: 'Sa', date: '01' },
        { label: 'Su', date: '02' },
      ]
    );
  }, [week]);

  return (
    <View style={[styles.root, style]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            console.log('streak pressed');
            onPressStreak?.();
          }}
          hitSlop={12}>
          <View style={styles.streakPill}>
            <Ionicons name='flame' size={18} color={colors.terracotta} />
            <Text style={styles.streakText}>{streakCount}</Text>
          </View>
        </Pressable>

        <Text style={styles.greeting} numberOfLines={1}>
          {greeting}
        </Text>

        {/* <Pressable
          onPress={onPressProfile}
          hitSlop={10}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressed,
          ]}>
          <Ionicons name='person' size={18} color='#111' />
        </Pressable> */}
      </View>

      {/* Week strip */}
      {/* <View style={styles.weekRow}>
        {days.map((d) => {
          const isSelected = d.label === selectedDayLabel;
          return (
            <View key={`${d.label}-${d.date ?? ''}`} style={styles.dayCell}>
              <View
                style={[
                  styles.dayPill,
                  isSelected ? styles.dayPillSelected : styles.dayPillGhost,
                ]}>
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected ? styles.dayLabelSelected : styles.dayLabelGhost,
                  ]}>
                  {d.label}
                </Text>

                {isSelected && checkedInToday ? (
                  <Ionicons
                    name='checkmark'
                    size={16}
                    color='#111'
                    style={{ marginTop: 2 }}
                  />
                ) : null}
              </View>

              <Text style={styles.dayDate}>{d.date ?? ''}</Text>
            </View>
          );
        })}
      </View> */}

      {/* <View style={styles.cardShadowWrap}>
        <View style={styles.card}>
          <View style={styles.cardIconRow}>
            <Ionicons name='leaf-outline' size={28} color='#EDEDED' />
          </View>

          <Text style={styles.cardKicker}>Daily Check-In</Text>

          <Text style={styles.cardTitle}>How are you{'\n'}doing today?</Text>

          <Pressable
            onPress={onPressBegin}
            hitSlop={10}
            style={({ pressed }) => [
              styles.beginButton,
              pressed && styles.beginPressed,
            ]}>
            <Text style={styles.beginText}>Begin</Text>
          </Pressable>
        </View>
      </View> */}

      {/* tiny social proof line (optional) */}
      {/* <Text style={styles.socialProof}>30,794 people checked-in today!</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 18,
    paddingTop: 10,
    position: 'absolute',
    top: 60,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakPill: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: 8,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 999,

    // FORCE visible surface
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',

    // Helps if something weird is overlapping
  },
  streakPillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  streakText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },

  greeting: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 22,
    color: 'black',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,1)',
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },

  weekRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  dayCell: {
    alignItems: 'center',
    width: 42,
  },

  dayPill: {
    width: 42,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
  },
  dayPillGhost: {
    backgroundColor: 'transparent',
  },

  dayLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  dayLabelSelected: {
    color: '#111',
  },
  dayLabelGhost: {
    color: 'rgba(0,0,0,0.20)',
  },

  dayDate: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.15)',
  },

  cardShadowWrap: {
    marginTop: 18,
    borderRadius: 34,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 14 },
      },
      android: { elevation: 10 },
      default: {},
    }),
  },

  card: {
    borderRadius: 34,
    paddingVertical: 26,
    paddingHorizontal: 22,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },

  cardIconRow: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 10,
  },

  cardKicker: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 8,
  },

  cardTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.4,
    marginBottom: 18,
  },

  beginButton: {
    height: 44,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
  },
  beginPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  beginText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
  },

  socialProof: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.35)',
  },
});
