// src/screens/ProjectBasicsScreen.tsx
import React, { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import WizardHeader from './WizardHeader';
import { useProjectDraft } from '@src/store/projectDraft';
import { listProjects } from '@src/db/projectsRepo';

export default function ProjectBasicsScreen() {
  const insets = useSafeAreaInsets();
  const { craft } = useLocalSearchParams<{ craft?: 'crochet' | 'knitting' }>();
  const setBasics = useProjectDraft((s) => s.setBasics);

  const [projectName, setProjectName] = useState('');
  const [tagDraft, setTagDraft] = useState('');
  const [tags, setTags] = useState<string[]>(['gift']);
  const [patternLink, setPatternLink] = useState('');
  const onBack = () => router.back();
  console.log('ALL PROJECTS:', listProjects());

  const onContinue = () => {
    setBasics({
      craft,
      name: projectName,
      tags,
      patternLink,
    });
    router.push({
      pathname: '/create-project/materials',
      params: { craft }, // carry it forward
    });
  };

  const canContinue = useMemo(
    () => projectName.trim().length > 0,
    [projectName]
  );

  const addTag = () => {
    const v = tagDraft.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setTagDraft('');
      return;
    }
    setTags((prev) => [...prev, v]);
    setTagDraft('');
  };

  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}>
      <WizardHeader step={1} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps='handled'>
          <Text style={styles.title}>Project basics</Text>

          {/* Project Name */}
          <View style={styles.card}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              value={projectName}
              onChangeText={setProjectName}
              style={styles.inputBig}
              placeholder='Enter a name'
              placeholderTextColor='#999'
            />
          </View>

          {/* Tags */}
          <View style={styles.card}>
            <View style={styles.tagsTopRow}>
              <Text style={styles.label}>Tags</Text>
              <Text style={styles.hashIcon}>#</Text>
              <View style={{ flex: 1 }} />
              <Text style={styles.tagsPlaceholder}>Add tags</Text>
              <View style={{ flex: 1 }} />
            </View>

            <View style={styles.divider} />

            <View style={styles.tagsRow}>
              {tags.map((t) => (
                <View key={t} style={styles.chip}>
                  <Text style={styles.chipText}>{t}</Text>
                  <Pressable
                    onPress={() => removeTag(t)}
                    hitSlop={10}
                    accessibilityRole='button'
                    accessibilityLabel={`Remove tag ${t}`}>
                    <Text style={styles.chipX}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* hidden-ish input (you can switch to a proper tag editor later) */}
            <TextInput
              value={tagDraft}
              onChangeText={setTagDraft}
              onSubmitEditing={addTag}
              style={styles.tagDraftInput}
              placeholder='Type a tag and press enter'
              placeholderTextColor='#AAA'
              returnKeyType='done'
            />
          </View>

          {/* Pattern */}
          <View style={styles.card}>
            <View style={styles.patternHeader}>
              <View>
                <Text style={styles.label}>Pattern</Text>
                <Text style={styles.caption}>(max 500kb)</Text>
              </View>

              <Pressable
                onPress={() => {
                  // TODO: hook up document picker
                  // e.g. expo-document-picker or react-native-document-picker
                }}
                hitSlop={10}
                style={styles.uploadButton}
                accessibilityRole='button'
                accessibilityLabel='Upload pattern'>
                <Text style={styles.uploadIcon}>⤴︎</Text>
              </Pressable>
            </View>

            <Text style={[styles.label, { marginTop: 12 }]}>Pattern Link</Text>
            <TextInput
              value={patternLink}
              onChangeText={setPatternLink}
              style={styles.inputBig}
              placeholder='https://...'
              placeholderTextColor='#999'
              autoCapitalize='none'
              keyboardType='url'
            />
          </View>

          <View style={{ height: 28 }} />

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <Pressable
              onPress={onBack}
              style={[styles.btn, styles.btnGhost]}
              accessibilityRole='button'>
              <Text style={styles.btnGhostText}>Back</Text>
            </Pressable>

            <Pressable
              onPress={canContinue ? onContinue : undefined}
              style={[
                styles.btn,
                styles.btnPrimary,
                !canContinue && { opacity: 0.4 },
              ]}
              accessibilityRole='button'>
              <Text style={styles.btnPrimaryText}>Continue</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 22,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      //   default: 'Fraunces',
    }),
    // fontFamily: 'Fraunces_700Bold',
    color: '#111',
  },
  card: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFF',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  caption: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
  },
  inputBig: {
    fontSize: 16,
    color: '#111',
    paddingVertical: 6,
  },

  tagsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hashIcon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginLeft: 4,
  },
  tagsPlaceholder: {
    fontSize: 16,
    color: '#777',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginTop: 12,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  chipText: { fontSize: 12, color: '#222' },
  chipX: { fontSize: 16, color: '#666', marginTop: -1 },

  tagDraftInput: {
    marginTop: 12,
    fontSize: 12,
    color: '#333',
    paddingVertical: 6,
  },

  patternHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  uploadButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  uploadIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    paddingTop: 6,
  },
  btn: {
    flex: 1,
    height: 54,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFF',
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  btnPrimary: {
    backgroundColor: '#53721F',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
