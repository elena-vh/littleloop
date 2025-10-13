import React, { useMemo, useState } from 'react';
import YarnIcon from '@assets/icons/yarn.svg';
import { Card } from '../ui/Card';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { Body } from '../ui/Text';
import { Button } from '../ui/Button';
import { useTheme } from '@react-navigation/native';
import { colors, spacing } from '@src/theme/tokens';

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // left yarn icon will mark today

type Props = {
  onMenu?: () => void;
  onLoggedToday?: (value: boolean) => void;
};
const KnittingTodayCard = ({ onMenu, onLoggedToday }: Props) => {
  const { theme } = useTheme();
  const [knitToday, setKnitToday] = useState(false);
  const [weekLog, setWeekLog] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const todayIndex = useMemo(() => new Date().getDay(), []);
  const label = knitToday ? 'Track progress' : 'I knitted today';
  console.log({ knitToday });
  const toggleToday = () => {
    const v = !knitToday;
    setKnitToday(v);
    setWeekLog((w) => w.map((x, i) => (i === todayIndex ? v : x)));
    onLoggedToday?.(v);
  };

  return (
    <Card style={styles.knitLog}>
      <Body style={styles.knitLogTitle}>Did you knit today?</Body>
      <View style={styles.row}>
        {/* weekday pills */}
        <View style={styles.pillsRow}>
          {WEEK.map((d, i) => {
            const active = weekLog[i];
            const isToday = i === todayIndex;
            return (
              <Pressable
                key={i}
                accessibilityRole='button'
                accessibilityLabel={`${d} ${active ? 'knit' : 'not knit'}`}
                style={[
                  styles.pill,
                  { backgroundColor: active ? 'none' : '#E9E9ED' },
                ]}>
                {active ? (
                  <YarnIcon width={21} height={21} />
                ) : (
                  <Text
                    style={{
                      color: '#5C5C66',
                      fontFamily: 'Quicksand_600SemiBold',
                    }}>
                    {d}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={toggleToday} style={styles.chip}>
          <Text style={styles.chipLabel}>{label}</Text>
        </Pressable>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 80,
  },
  title: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 28,
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: spacing.md,
    flexShrink: 1,
  },
  pill: {
    width: 21,
    height: 21,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    marginLeft: 10,
    marginTop: 10,
    backgroundColor: colors.beige,
    height: 27,
    width: 60,
    verticalAlign: 'middle',
    borderRadius: 17,
    alignItems: 'flex-end',
    fontSize: 11,
    justifyContent: 'center',
  },
  chipLabel: {
    fontFamily: 'Quicksand_700Bold',
    textAlign: 'center',
    fontSize: 9,
    color: '#1C1917',
  },
  overflow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E9E9ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  knitLog: {
    position: 'absolute',
    top: 100,
    width: '90%',
    height: 96,
  },
  knitLogTitle: {
    fontFamily: 'Fraunces_400Regular',
    fontSize: 18,
  },
});
export default KnittingTodayCard;
