import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, font, radius } from '@src/theme/theme';

export default function CraftPickerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  const go = (craft: 'crochet' | 'knitting') => {
    onClose();
    requestAnimationFrame(() => {
      router.push({
        pathname: '/create-project/project-basics',
        params: { craft },
      });
    });
  };

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
          onPress={(e) => e.stopPropagation()}>
          <View style={styles.grabber} />
          <View style={styles.headRow}>
            <Text style={styles.title}>New project</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
              <X size={18} strokeWidth={2.75} color={color.text} />
            </Pressable>
          </View>
          <View style={[styles.row, { marginTop: 18 }]}>
            <Pressable style={styles.card} onPress={() => go('knitting')}>
              <Text style={styles.cardTitle}>Knitting</Text>
            </Pressable>
            <Pressable style={styles.card} onPress={() => go('crochet')}>
              <Text style={styles.cardTitle}>Crochet</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(32,30,29,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: color.neutral[300],
    marginBottom: 16,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontFamily: font.heading, fontSize: 22, color: color.text },
  close: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kicker: {
    fontFamily: font.bodySemi,
    fontSize: 10,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginTop: 6,
    marginBottom: 14,
  },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    minHeight: 96,
    borderRadius: radius.card,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontFamily: font.heading, fontSize: 18, color: color.text },
});
