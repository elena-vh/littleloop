import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, Upload } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { useProjectDraft } from '@src/store/projectDraft';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Field, { fieldStyles } from './Field';

export default function ProjectBasicsScreen() {
  const insets = useSafeAreaInsets();
  const { craft } = useLocalSearchParams<{ craft?: 'crochet' | 'knitting' }>();
  const setBasics = useProjectDraft((s) => s.setBasics);

  const [name, setName] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [patternLink, setPatternLink] = useState('');

  const canContinue = useMemo(() => name.trim().length > 0, [name]);

  const addTag = () => {
    const v = tagDraft.trim();
    if (!v || tags.includes(v)) return setTagDraft('');
    setTags((p) => [...p, v]);
    setTagDraft('');
  };

  const onContinue = () => {
    setBasics({ craft, name, tags, patternLink });
    router.push({ pathname: '/create-project/materials', params: { craft } });
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}>
          <WizardHeader step={1} title='Project basics' />

          <Field label='Project name'>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
              placeholder='Enter a name'
              placeholderTextColor={color.neutral[600]}
            />
          </Field>

          <Field label='Tags'>
            {tags.length > 0 && (
              <View style={styles.tagRow}>
                {tags.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setTags((p) => p.filter((x) => x !== t))}
                    style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{t}</Text>
                    <X size={13} strokeWidth={3} color={color.acc2[800]} />
                  </Pressable>
                ))}
              </View>
            )}
            <TextInput
              value={tagDraft}
              onChangeText={setTagDraft}
              onSubmitEditing={addTag}
              style={styles.tagInput}
              placeholder='Type a tag and press enter'
              placeholderTextColor={color.neutral[600]}
              returnKeyType='done'
            />
          </Field>

          <Field label='Pattern file'>
            <View style={styles.patternTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.patternHint}>PDF or photo, max 500 kb</Text>
              </View>
              <Pressable style={styles.uploadBtn} accessibilityLabel='Upload pattern'>
                <Upload size={20} strokeWidth={2.75} color={color.acc[800]} />
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Text style={styles.subKicker}>Or paste a link</Text>
            <TextInput
              value={patternLink}
              onChangeText={setPatternLink}
              style={fieldStyles.input}
              placeholder='https://…'
              placeholderTextColor={color.neutral[600]}
              autoCapitalize='none'
              keyboardType='url'
            />
          </Field>

          <WizardFooter
            onBack={() => router.back()}
            onNext={onContinue}
            nextLabel='Continue'
            nextDisabled={!canContinue}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg, paddingHorizontal: 22 },
  content: { paddingTop: 24, paddingBottom: 24 },
  nameInput: {
    fontFamily: font.heading,
    fontSize: 20,
    color: color.text,
    paddingVertical: 2,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingLeft: 13,
    paddingRight: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: color.acc2[100],
  },
  tagChipText: {
    fontFamily: font.bodySemi,
    fontSize: 12.5,
    color: color.acc2[800],
  },
  tagInput: {
    fontFamily: font.body,
    fontSize: 13.5,
    color: color.text,
    paddingVertical: 4,
  },
  patternTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  patternHint: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.neutral[700],
  },
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.acc[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: color.divider,
    marginVertical: 14,
  },
  subKicker: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    letterSpacing: 0.3,
    color: color.acc[700],
    marginBottom: 4,
  },
});
