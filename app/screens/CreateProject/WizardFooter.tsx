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
          nextDisabled && { opacity: 0.4 },
        ]}>
        <Text style={styles.nextText}>{nextLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: color.divider,
  },
  btn: {
    minHeight: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.divider,
  },
  backPressed: { backgroundColor: 'rgba(32,30,29,0.06)' },
  backText: { fontFamily: font.bodySemi, fontSize: 15, color: color.text },
  next: { flex: 1.4, backgroundColor: color.accent },
  nextPressed: { backgroundColor: color.acc[600] },
  nextText: { fontFamily: font.bodySemi, fontSize: 15, color: color.bg },
});
