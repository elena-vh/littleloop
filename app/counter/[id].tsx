import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { color, font, radius } from '@src/theme/theme';

// Placeholder — the full-screen round counter is built in Step 4.
export default function CounterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.root}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
        <ChevronLeft size={20} strokeWidth={2.75} color={color.text} />
      </Pressable>
      <View style={styles.center}>
        <Text style={styles.title}>Row counter</Text>
        <Text style={styles.sub}>Coming in the next step.</Text>
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
