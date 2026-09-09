import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { Task, useTasks } from '@src/store/tasks';

type Props = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  defaultText?: string;
  projectId?: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  selectedTask?: Task | null;
  text: string;
};

export default function AddTaskModal({
  visible,
  onClose,
  projectId,
  onDelete,
  setText,
  text,
  selectedTask = null,
}: Props) {
  const insets = useSafeAreaInsets();
  const update = useTasks((s) => s.update);
  const add = useTasks((s) => s.add);
  const remove = useTasks((s) => s.remove);

  const canSave = text.trim().length > 0;
  const editing = !!selectedTask?.id;

  const save = () => {
    if (!canSave) return;
    Keyboard.dismiss();
    if (editing) update(selectedTask!.id, { text: text.trim() });
    else add(text.trim(), undefined, projectId);
    onClose();
  };

  const del = () => {
    if (selectedTask) remove(selectedTask.id);
    onDelete();
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
        style={styles.avoider}>
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.headRow}>
            <Pressable onPress={onClose} hitSlop={10} style={styles.iconBtn}>
              <X size={18} strokeWidth={2.75} color={color.text} />
            </Pressable>
            <Text style={styles.title}>{editing ? 'Edit task' : 'New task'}</Text>
            {editing ? (
              <Pressable onPress={del} hitSlop={10} style={styles.iconBtn}>
                <Trash2 size={18} strokeWidth={2.75} color={color.accent} />
              </Pressable>
            ) : (
              <View style={styles.iconBtn} />
            )}
          </View>

          <TextInput
            multiline
            style={styles.input}
            placeholder='Start typing your idea…'
            placeholderTextColor={color.neutral[600]}
            value={text}
            onChangeText={setText}
            autoFocus
            accessibilityLabel='Task description'
          />

          <Pressable
            onPress={save}
            disabled={!canSave}
            style={[styles.saveBtn, !canSave && { opacity: 0.4 }]}>
            <Text style={styles.saveText}>{editing ? 'Save changes' : 'Add task'}</Text>
          </Pressable>
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
    paddingTop: 12,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: font.heading, fontSize: 16, color: color.text },
  input: {
    minHeight: 110,
    textAlignVertical: 'top',
    fontFamily: font.body,
    fontSize: 18,
    lineHeight: 25,
    color: color.text,
    backgroundColor: color.surface,
    borderRadius: radius.card,
    padding: 16,
  },
  saveBtn: {
    marginTop: 16,
    minHeight: 50,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { fontFamily: font.bodySemi, fontSize: 15, color: color.bg },
});
