import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { color, font, radius } from '@src/theme/theme';

export default function WizardFooter({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.btn,
          styles.back,
          pressed && styles.backPressed,
        ]}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Pressable
        onPress={nextDisabled ? undefined : onNext}
        style={({ pressed }) => [
          styles.btn,
          styles.next,
          pressed && !nextDisabled && styles.nextPressed,
          nextDisabled && styles.nextDisabled,
        ]}>
        <Text style={styles.nextText}>{nextLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: color.divider,
  },
  btn: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: 0,
  },
  back: {
    flexGrow: 5,
    borderWidth: 1,
    borderColor: color.divider,
  },
  backPressed: { backgroundColor: 'rgba(32,30,29,0.06)' },
  backText: { fontFamily: font.bodySemi, fontSize: 15, color: color.text },
  nextText: { fontFamily: font.bodySemi, fontSize: 15, color: color.text },
  next: {
    flexGrow: 7,
    backgroundColor: color.accent,
  },
  nextPressed: { backgroundColor: color.acc[600] },
  nextDisabled: { opacity: 0.4 },
});
