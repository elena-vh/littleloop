import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, radius, shadow } from '@src/theme/tokens';

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    margin: 16,
    ...shadow.sm,
  },
});
