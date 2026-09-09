import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  TextInput,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { ArrowUp, SlidersHorizontal } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { useTasks } from '@src/store/tasks';

type Props = {
  visible: boolean;
  onClose: () => void;
  openModal: () => void;
  defaultText?: string;
  projectId?: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
};

export default function AddTaskInput({
  visible,
  onClose,
  defaultText = '',
  projectId,
  openModal,
  setText,
  text,
}: Props) {
  const add = useTasks((s) => s.add);
  const insets = useSafeAreaInsets();
  const [srOn, setSrOn] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setSrOn);
  }, []);
  useEffect(() => {
    if (visible) setText(defaultText);
  }, [visible, defaultText]);

  const canSave = text.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    Keyboard.dismiss();
    add(text.trim(), undefined, projectId);
    onClose();
  };

  const openDetails = () => {
    Keyboard.dismiss();
    openModal();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.avoider}
        keyboardVerticalOffset={-insets.bottom}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <TextInput
            multiline
            style={styles.input}
            placeholder='Start typing your idea…'
            placeholderTextColor={color.neutral[600]}
            value={text}
            onChangeText={setText}
            autoFocus={!srOn}
            returnKeyType='done'
            onSubmitEditing={save}
            accessibilityLabel='Task description'
          />
          <View style={styles.actions}>
            <Pressable
              onPress={openDetails}
              hitSlop={10}
              style={styles.optionsBtn}
              accessibilityLabel='More options'>
              <SlidersHorizontal
                size={19}
                strokeWidth={2.75}
                color={color.text}
              />
            </Pressable>
            <Pressable
              onPress={save}
              hitSlop={10}
              disabled={!canSave}
              style={[styles.saveBtn, !canSave && { opacity: 0.4 }]}
              accessibilityLabel='Save task'>
              <ArrowUp size={22} strokeWidth={2.75} color={color.bg} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(32,30,29,0.35)',
  },
  avoider: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: color.bg,
    borderTopLeftRadius: radius.cardLg,
    borderTopRightRadius: radius.cardLg,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  input: {
    minHeight: 96,
    textAlignVertical: 'top',
    fontFamily: font.body,
    fontSize: 18,
    lineHeight: 25,
    color: color.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  optionsBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
