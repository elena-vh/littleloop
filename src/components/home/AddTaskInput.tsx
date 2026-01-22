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
  ScrollView,
} from 'react-native';
import Save from '@assets/icons/save.svg';
import DisabledSave from '@assets/icons/disabled_save.svg';
import Options from '@assets/icons/options.svg';
import KittyButton from '@assets/icons/kitty_button.svg';
import Quotes from '@assets/icons/quotes.svg';
import { useTasks } from '@src/store/tasks';
import { spacing } from '@src/theme/tokens';
import TrashIcon from '@assets/icons/trash.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  openModal: () => void;
  defaultText?: string;
  projectId?: string;
  setText;
  text;
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
  const insets = useSafeAreaInsets(); // { top, bottom, left, right }

  //   const [text, setText] = useState(defaultText);
  const [isScreenReaderOn, setIsScreenReaderOn] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderOn);
  }, []);

  useEffect(() => {
    if (visible) {
      setText(defaultText);
    }
  }, [visible, defaultText]);

  const save = () => {
    if (!text.trim()) {
      // simple guard — you can enhance with error UI
      return;
    }
    Keyboard.dismiss();
    add(text.trim(), undefined, projectId);
    onClose();
  };
  const openDetailsModal = () => {
    // add(text.trim(), undefined, projectId);
    // if (!text.trim()) return; // optional guard
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
      onRequestClose={onClose}
      accessible
      accessibilityViewIsModal>
      <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
        {/* backdrop */}
        {/* <TouchableWithoutFeedback onPress={onClose} accessible={false}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback> */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* modal content */}
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={styles.avoider}
          keyboardVerticalOffset={-insets.bottom}>
          <View style={[styles.container, {}]} accessibilityLiveRegion='polite'>
            <View>
              <TextInput
                multiline
                style={[styles.input]}
                placeholder='Start typing your ideas'
                placeholderTextColor='#9CA3AF'
                value={text}
                onChangeText={setText}
                autoFocus={!isScreenReaderOn} // avoid autoFocus if SR is active
                returnKeyType='done'
                onSubmitEditing={save}
                accessibilityLabel='Task description'
              />
            </View>
            {text.trim().length > 0 ? (
              <Pressable onPress={save} hitSlop={12} style={styles.saveButton}>
                <Save />
              </Pressable>
            ) : (
              <DisabledSave style={styles.saveButton} />
            )}
            <Pressable
              onPress={openDetailsModal}
              hitSlop={12}
              style={styles.options}>
              <Options />
            </Pressable>
          </View>
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  quotes: {
    position: 'absolute',
    top: 25,
    left: 10,
  },
  avoider: {
    flex: 1,
    justifyContent: 'flex-end', // slide up from bottom
  },
  container: {
    backgroundColor: '#F0F0F0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    // paddingBottom: spacing['2xl'],
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
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 18,
  },
  closeButton: {
    padding: 8,
  },
  closeX: {
    fontSize: 18,
    color: '#6B7280',
  },
  input: {
    // position: 'relative',
    height: 150,
    textAlignVertical: 'top',
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 14,
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
  saveButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 50,
    right: 20,
  },
  options: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 50,
    right: 65,
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
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 15,
  },
  primaryLabel: {
    color: '#fff',
  },
  ghostLabel: {
    color: '#374151',
  },
});
