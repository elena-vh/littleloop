import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// NOTE: not yet on the Organic system — restyled with the add-project flow.
// Kept functional so project creation still works from Home.
export default function CraftPickerModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
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
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.backdrop}>
        <View style={styles.surface}>
          <View style={styles.cardsRow}>
            <Pressable style={styles.card} onPress={() => go('crochet')}>
              <Text style={styles.cardTitle}>Crochet</Text>
            </Pressable>
            <Pressable style={styles.card} onPress={() => go('knitting')}>
              <Text style={styles.cardTitle}>Knitting</Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={styles.closeFab} hitSlop={12}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    width: 800,
    marginTop: 200,
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 450,
    borderTopRightRadius: 450,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsRow: { flexDirection: 'row', gap: 16, marginBottom: 26 },
  card: {
    width: 130,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#707070',
  },
  closeFab: {
    position: 'absolute',
    bottom: 30,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
