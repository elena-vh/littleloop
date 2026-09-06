// src/components/AddTaskModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { Animated, PanResponder } from 'react-native';

import KittyButton from '@assets/icons/kitty_button.svg';
import DisabledSave from '@assets/icons/disabled_save_big.svg';
import Close from '@assets/icons/close.svg';
import Save from '@assets/icons/save_big.svg';

import Quotes from '@assets/icons/quotes.svg';
import { Task, useTasks } from '@src/store/tasks';
import { radius, spacing } from '@src/theme/tokens';
import DeleteTask from '@assets/icons/delete_task.svg';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Card } from '../ui/Card';
import Select, { Option } from '../ui/Select';

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
type projects = {
  label: string;
};

export default function AddTaskModal({
  visible,
  onClose,
  defaultText = '',
  projectId,
  onDelete,
  setText,
  text,
  selectedTask = null,
}: Props) {
  const insets = useSafeAreaInsets(); // { top, bottom, left, right }
  const update = useTasks((s) => s.update);
  const add = useTasks((s) => s.add);
  const remove = useTasks((s) => s.remove);
  const { tasks } = useTasks();
  const projects = [{ label: 'Baby hat', value: 'baby hat' }];
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(false);

  const createTask = () => {
    if (!text.trim()) {
      return;
    }
    add(text.trim(), undefined, projectId);
    onClose();
  };
  const editTask = () => {
    if (!text.trim()) {
      return;
    }
    const value = text.trim();

    if (selectedTask) update(selectedTask.id, { text: value });
    onClose();
  };
  const deleteTask = () => {
    if (selectedTask) remove(selectedTask.id);
    onClose();
  };
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: 0 }], bottom: 0 }]}>
      <Modal
        presentationStyle='pageSheet'
        visible={visible}
        animationType='slide'
        transparent
        statusBarTranslucent
        onRequestClose={onClose}
        accessible
        accessibilityViewIsModal
        style={{ height: '100%' }}>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableWithoutFeedback onPress={onClose} accessible={false}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            style={styles.avoider}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}>
              <View style={styles.container} accessibilityLiveRegion='polite'>
                <View style={styles.headerRow}>
                  <Pressable onPress={onClose} accessibilityLabel='Close'>
                    <Close />
                  </Pressable>

                  {text.trim().length > 0 ? (
                    <Save
                      style={styles.saveButton}
                      onPress={selectedTask?.id ? editTask : createTask}
                    />
                  ) : (
                    <DisabledSave style={styles.saveButton} />
                  )}
                </View>
                <View>
                  <TextInput
                    multiline
                    style={styles.input}
                    placeholder='Start typing your ideas'
                    placeholderTextColor='#9CA3AF'
                    value={text}
                    onChangeText={setText}
                    autoFocus={!isScreenReaderOn}
                    returnKeyType='done'
                    onSubmitEditing={selectedTask?.id ? editTask : createTask}
                    accessibilityLabel='Task description'
                  />
                </View>
                <View>
                  <Card
                    style={{
                      gap: 16,
                      display: 'flex',
                      position: 'relative',
                      padding: 10,
                    }}>
                    <View>
                      <Select
                        label='Assign to project'
                        options={projects}
                        value='baby hat'
                        onChange={() => {}}
                      />
                    </View>
                    <View
                      style={{ borderColor: '#F6F5F3', borderBottomWidth: 1 }}
                    />
                    <Select
                      label='Importance'
                      options={[{ label: 'Baby hat', value: 'baby hat' }]}
                      value='aaa'
                      onChange={() => {}}
                    />
                  </Card>
                </View>
                <View style={styles.actionsRow}>
                  <Pressable onPress={onDelete}>
                    <DeleteTask
                      style={styles.deleteButton}
                      onPress={deleteTask}
                    />
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F6F5F3',
    height: '100%',
  },
  quotes: {
    position: 'absolute',
    top: 25,
    left: 30,
  },
  avoider: {
    flex: 1,
    justifyContent: 'flex-end', // slide up from bottom
  },
  saveButton: { position: 'absolute', top: 0, right: 0 },
  deleteButton: { top: 20, marginBottom: 20, marginHorizontal: spacing.lg },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing['2xl'],
    marginTop: 40,
    paddingBottom: spacing['2xl'],
    // subtle shadow on top
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  title: {
    fontFamily: 'Mulish_600SemiBold',
    fontSize: 18,
  },
  label: { fontFamily: 'Mulish_600SemiBold', fontSize: 16 },

  closeX: {
    fontSize: 18,
    color: '#6B7280',
  },
  input: {
    position: 'relative',
    height: 120,
    marginHorizontal: spacing.lg,
    top: 0,
    textAlignVertical: 'top',
    borderRadius: radius.lg,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 20,
    paddingLeft: 20,
    fontFamily: 'Fraunces_300Light',
    fontSize: 20,
    color: '#111827',
    marginTop: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  kittyButton: {
    alignSelf: 'center',
    position: 'absolute',
    marginBottom: 10,
  },
  button: {
    borderRadius: 30,
    marginTop: 55,
    paddingVertical: 12,
    paddingHorizontal: 18,
    width: '100%',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#282929',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E6E6E9',
  },
  buttonLabel: {
    fontFamily: 'Mulish_600SemiBold',
    fontSize: 15,
  },
  primaryLabel: {
    color: '#fff',
  },
  ghostLabel: {
    color: '#374151',
  },
});
