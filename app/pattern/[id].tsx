import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { color, font, radius } from '@src/theme/theme';

// Placeholder — the pattern viewer is built in Step 5.
export default function PatternScreen() {
  return (
    <View style={styles.root}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
        <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>Pattern</Text>
        <Text style={styles.sub}>Coming in a later step.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg, paddingTop: 56, paddingHorizontal: 20 },
  back: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontFamily: font.heading, fontSize: 22, color: color.text },
  sub: { fontFamily: font.body, fontSize: 14, color: color.neutral[700] },
});
