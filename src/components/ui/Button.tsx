import { Pressable, Text, StyleSheet, ViewProps } from 'react-native';
import { colors, radius, shadow } from '@src/theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export function Button({
  style,
  label,
  onPress,
  variant = 'primary',
}: Props & ViewProps) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={[
        style,
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        shadow.sm,
      ]}>
      <Text
        style={[
          styles.label,
          { color: isPrimary ? colors.white : colors.gray900 },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.purple,
  },
  secondary: {
    backgroundColor: colors.lavender,
  },
  label: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: 16,
  },
});
