// app/(tabs)/settings.tsx
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@src/theme/ThemeProvider';

export default function Profile() {
  const { mode, setMode, theme, isDark } = useTheme();
  const Item = ({
    value,
    label,
  }: {
    value: 'light' | 'dark' | 'system';
    label: string;
  }) => (
    <Pressable
      onPress={() => setMode(value)}
      style={{ paddingVertical: 12 }}
      accessibilityRole='radio'
      accessibilityState={{ selected: mode === value }}>
      <Text
        style={{
          color: mode === value ? theme.colors.primary : theme.colors.text,
        }}>
        {label} {mode === value ? '✓' : ''}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 20 }}>
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 18,
          marginBottom: 12,
          fontFamily: 'Fraunces_600SemiBold',
        }}>
        Appearance
      </Text>
      <Item value='system' label='System' />
      <Item value='light' label='Light' />
      <Item value='dark' label='Dark' />
      <Text style={{ color: theme.colors.subtext, marginTop: 24 }}>
        Current: {isDark ? 'Dark' : 'Light'} (mode: {mode})
      </Text>
    </View>
  );
}
