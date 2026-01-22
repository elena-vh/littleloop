// src/components/ui/Select.tsx
import React, { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  LayoutRectangle,
} from 'react-native';
import Chevron from '@assets/icons/chevron.svg';

export type Option<T extends string> = { label: string; value: T };
type Props<T extends string> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
};

export default function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  const anchorRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<LayoutRectangle | null>(null);
  const { width: screenW, height: screenH } = useWindowDimensions();

  const openMenu = () => {
    // measure anchor (row) in window coords
    anchorRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, width: w, height: h } as any);
      setOpen(true);
    });
  };

  const close = () => setOpen(false);

  // popover frame
  const cardWidth = screenW - 24 * 2; // margins left/right
  const cardLeft = 24;
  const cardTop = anchor
    ? Math.min(anchor.y + anchor.height + 8, screenH - 220)
    : 120;

  return (
    <>
      {/* Anchor row */}
      <View style={styles.wrapper} ref={anchorRef}>
        <Pressable
          onPress={openMenu}
          style={styles.row}
          accessibilityRole='button'
          accessibilityLabel={label}>
          <Text style={styles.left}>{label}</Text>
        </Pressable>
        <View style={styles.valueWrap}>
          <Text style={styles.value}>
            {options.find((o) => o.value === value)?.label}
          </Text>
          {/* <Text style={styles.chev}>▾</Text> */}
          <Chevron />
        </View>
      </View>

      {/* Popover */}
      <Modal
        visible={open}
        transparent
        animationType='fade'
        onRequestClose={close}>
        {/* Backdrop */}
        <Pressable onPress={close} style={StyleSheet.absoluteFill} />

        {/* Card */}
        <View
          style={[
            styles.card,
            { width: cardWidth, left: cardLeft, top: cardTop },
          ]}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                onChange(opt.value);
                close();
              }}
              style={styles.option}
              accessibilityRole='menuitem'>
              <Text style={styles.optionText}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // light inset divider look
    // shadowColor: '#000',
    // shadowOpacity: 0.04,
    // shadowRadius: 8,
    // shadowOffset: { width: 0, height: 2 },
  },
  left: { fontSize: 16, color: '#222', fontFamily: 'Mulish_600SemiBold' },
  valueWrap: {
    flexDirection: 'row',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    backgroundColor: '#F6F5F3',
    borderRadius: 20,
    padding: 8,
    height: 40,
  },
  value: { fontSize: 16, color: '#3f3f46', fontFamily: 'Mulish_600SemiBold' },

  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 10,
    // big rounded “sheet” look
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  option: { paddingVertical: 14, paddingHorizontal: 18 },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Mulish_600SemiBold',
  },
});
