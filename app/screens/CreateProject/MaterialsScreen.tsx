import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ChevronRight, Check, Plus, Minus } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { color, font, radius } from '@src/theme/theme';
import { useProjectDraft } from '@src/store/projectDraft';
import { useYarn } from '@src/store/yarn';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Field, { fieldStyles } from './Field';
import YarnSwatch from '@src/components/ui/YarnSwatch';

export default function MaterialsScreen() {
  const insets = useSafeAreaInsets();
  const { craft } = useLocalSearchParams<{ craft?: 'crochet' | 'knitting' }>();
  const setMaterials = useProjectDraft((s) => s.setMaterials);
  const yarns = useYarn((s) => s.yarns);

  const [yarnId, setYarnId] = useState<string | undefined>(yarns[0]?.id);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tools, setTools] = useState('');
  const [skeins, setSkeins] = useState(1);

  const selected = useMemo(
    () => yarns.find((y) => y.id === yarnId),
    [yarns, yarnId]
  );

  const onContinue = () => {
    setMaterials({ yarnId, tools, skeins });
    router.push({ pathname: '/create-project/plan-track', params: { craft } });
  };

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}>
        <WizardHeader step={2} title='Materials' />

        <Field label='Yarn from your stash'>
          <Pressable
            style={styles.yarnRow}
            onPress={() => setPickerOpen((v) => !v)}>
            {selected ? (
              <>
                <YarnSwatch color={selected.swatch} size={38} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.yarnName} numberOfLines={1}>
                    {selected.brand}
                  </Text>
                  <Text style={styles.yarnMeta} numberOfLines={1}>
                    {selected.colorway} · {selected.weight} · {selected.skeins} left
                  </Text>
                </View>
              </>
            ) : (
              <Text style={[styles.yarnName, { flex: 1 }]}>Choose a yarn</Text>
            )}
            <ChevronRight
              size={18}
              strokeWidth={2.75}
              color={color.neutral[600]}
            />
          </Pressable>

          {pickerOpen && (
            <View style={styles.picker}>
              {yarns.map((y) => (
                <Pressable
                  key={y.id}
                  style={styles.pickerItem}
                  onPress={() => {
                    setYarnId(y.id);
                    setPickerOpen(false);
                  }}>
                  <YarnSwatch color={y.swatch} size={28} />
                  <Text style={styles.pickerText} numberOfLines={1}>
                    {y.brand} · {y.colorway}
                  </Text>
                  {y.id === yarnId && (
                    <Check size={16} strokeWidth={3} color={color.accent} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </Field>

        <Field label='Tools'>
          <TextInput
            value={tools}
            onChangeText={setTools}
            style={fieldStyles.input}
            placeholder='e.g. 4.5 mm circular needles'
            placeholderTextColor={color.neutral[600]}
          />
        </Field>

        <Field label='Number of skeins'>
          <View style={styles.stepper}>
            <Pressable
              style={styles.stepMinus}
              onPress={() => setSkeins((n) => Math.max(1, n - 1))}
              accessibilityLabel='Fewer skeins'>
              <Minus size={22} strokeWidth={2.75} color={color.text} />
            </Pressable>
            <Text style={styles.stepCount}>{skeins}</Text>
            <Pressable
              style={styles.stepPlus}
              onPress={() => setSkeins((n) => n + 1)}
              accessibilityLabel='More skeins'>
              <Plus size={22} strokeWidth={2.75} color={color.bg} />
            </Pressable>
          </View>
        </Field>

        <WizardFooter
          onBack={() => router.back()}
          onNext={onContinue}
          nextLabel='Continue'
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg, paddingHorizontal: 22 },
  content: { paddingTop: 24, paddingBottom: 24 },

  yarnRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  yarnName: { fontFamily: font.heading, fontSize: 16, color: color.text },
  yarnMeta: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.neutral[700],
    marginTop: 2,
  },
  picker: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: color.divider,
    paddingTop: 8,
    gap: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  pickerText: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 13.5,
    color: color.text,
  },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepMinus: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepPlus: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCount: {
    flex: 1,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 32,
    color: color.text,
  },
});
