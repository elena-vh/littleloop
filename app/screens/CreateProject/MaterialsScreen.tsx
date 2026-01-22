// src/screens/MaterialsScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useProjectDraft } from '@src/store/projectDraft';
import WizardHeader from './WizardHeader';

const YARNS = [
  'Schachenmayr Pink 100% Cotton 50g',
  'Schachenmayr Blue 100% Cotton 50g',
  'Schachenmayr Green 100% Cotton 50g',
];

export default function MaterialsScreen() {
  const insets = useSafeAreaInsets();
  const { craft } = useLocalSearchParams<{ craft?: 'crochet' | 'knitting' }>();
  const setMaterials = useProjectDraft((s) => s.setMaterials);

  const [yarnQuery, setYarnQuery] = useState('Schachenmayr Pin');
  const [yarnSelected, setYarnSelected] = useState<string | null>(null);
  const [yarnFocused, setYarnFocused] = useState(false);

  const [tools, setTools] = useState('4.5mm circular needles');
  const [skeins, setSkeins] = useState('10');

  const filtered = useMemo(() => {
    const q = yarnQuery.trim().toLowerCase();
    if (!q) return YARNS;
    return YARNS.filter((y) => y.toLowerCase().includes(q));
  }, [yarnQuery]);

  const showDropdown = yarnFocused && filtered.length > 0;
  const onContinue = () => {
    setMaterials({
      yarnId: 'selectedYarnId',
      tools,
      skeins: Number(skeins || 0),
    });

    router.push({
      pathname: '/create-project/plan-track',
      params: { craft }, // carry it forward
    });
  };
  const onBack = () => router.back();

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 },
      ]}>
      <WizardHeader step={2} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'>
        <Text style={styles.title}>Materials</Text>

        {/* Yarn */}
        <View style={styles.card}>
          <Text style={styles.label}>Yarn</Text>

          <View style={styles.searchRow}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              value={yarnSelected ?? yarnQuery}
              onChangeText={(t) => {
                setYarnSelected(null);
                setYarnQuery(t);
              }}
              onFocus={() => setYarnFocused(true)}
              onBlur={() => {
                // small delay helps tapping a suggestion without losing it immediately
                setTimeout(() => setYarnFocused(false), 80);
              }}
              placeholder='Search yarn'
              placeholderTextColor='#999'
              style={styles.searchInput}
            />
          </View>
        </View>

        {showDropdown && (
          <View style={styles.dropdown}>
            {filtered.slice(0, 5).map((item, idx) => {
              const highlighted = idx === 0; // matches screenshot vibe
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setYarnSelected(item);
                    setYarnFocused(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    highlighted && styles.dropdownItemHighlighted,
                  ]}>
                  <Text style={styles.dropdownText}>{item}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Tools */}
        <View style={styles.card}>
          <Text style={styles.label}>Tools</Text>
          <TextInput
            value={tools}
            onChangeText={setTools}
            style={styles.inputBig}
            placeholder='e.g. 4.5mm circular needles'
            placeholderTextColor='#999'
          />
        </View>

        {/* Number of skeins */}
        <View style={styles.card}>
          <Text style={styles.label}>Number of skeins</Text>
          <TextInput
            value={skeins}
            onChangeText={setSkeins}
            style={styles.inputBig}
            placeholder='0'
            placeholderTextColor='#999'
            keyboardType='number-pad'
          />
        </View>

        <View style={{ height: 28 }} />

        <View style={styles.buttonsRow}>
          <Pressable
            onPress={onBack}
            style={[styles.btn, styles.btnGhost]}
            accessibilityRole='button'>
            <Text style={styles.btnGhostText}>Back</Text>
          </Pressable>

          <Pressable
            onPress={onContinue}
            style={[styles.btn, styles.btnPrimary]}
            accessibilityRole='button'>
            <Text style={styles.btnPrimaryText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
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
    marginBottom: 8,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  searchIcon: {
    fontSize: 18,
    color: '#222',
    marginTop: -2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
    paddingVertical: 6,
  },

  dropdown: {
    marginTop: -6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownItemHighlighted: {
    backgroundColor: '#F2F2F2',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
  },

  inputBig: {
    fontSize: 16,
    color: '#111',
    paddingVertical: 6,
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
    backgroundColor: '#111',
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
