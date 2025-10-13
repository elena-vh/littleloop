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
import KittyButton from '@assets/icons/kitty_button.svg';
import Quotes from '@assets/icons/quotes.svg';
import { useTasks } from '@src/store/tasks';
import { spacing } from '@src/theme/tokens';

type Props = {
  visible: boolean;
  onClose: () => void;
  defaultText?: string;
  projectId?: string;
};

export default function AddTaskModal({
  visible,
  onClose,
  defaultText = '',
  projectId,
}: Props) {
  const add = useTasks((s) => s.add);
  const [text, setText] = useState(defaultText);
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
    add(text.trim(), undefined, projectId);
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
      {/* backdrop */}
      <TouchableWithoutFeedback onPress={onClose} accessible={false}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* modal content */}
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.avoider}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container} accessibilityLiveRegion='polite'>
            <View style={styles.headerRow}>
              {/* <Text style={styles.title}>Add task</Text> */}

              <Pressable
                onPress={onClose}
                accessibilityLabel='Close'
                style={styles.closeButton}>
                <Text style={styles.closeX}>✕</Text>
              </Pressable>
            </View>
            <View>
              <TextInput
                multiline
                style={styles.input}
                placeholder='Start typing your ideas'
                placeholderTextColor='#9CA3AF'
                value={text}
                onChangeText={setText}
                autoFocus={!isScreenReaderOn} // avoid autoFocus if SR is active
                returnKeyType='done'
                onSubmitEditing={save}
                accessibilityLabel='Task description'
              />
              <Quotes style={styles.quotes} />
            </View>
            <View style={styles.actionsRow}>
              {/* <Pressable
                onPress={onClose}
                style={[styles.button, styles.ghost]}>
                <Text style={[styles.buttonLabel, styles.ghostLabel]}>
                  Cancel
                </Text>
              </Pressable> */}
              <KittyButton style={styles.kittyButton} width={60} />
              <Pressable onPress={save} style={[styles.button, styles.primary]}>
                <Text style={[styles.buttonLabel, styles.primaryLabel]}>
                  Save
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['2xl'],
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
    position: 'relative',
    height: 150,
    textAlignVertical: 'top',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 14,
    paddingTop: 60,
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
