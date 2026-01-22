// src/components/WizardHeader.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

type Props = {
  step: 1 | 2 | 3;
  onStepPress?: (step: 1 | 2 | 3) => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
};

export default function WizardHeader({
  step,
  onStepPress,
  rightIcon,
  onRightPress,
}: Props) {
  const steps: Array<1 | 2 | 3> = [1, 2, 3];

  return (
    <View style={styles.row}>
      <View style={styles.stepper}>
        {steps.map((s, idx) => {
          const isActive = s <= step;
          const isCurrent = s === step;

          return (
            <React.Fragment key={s}>
              {/* <Pressable
                onPress={() => onStepPress?.(s)}
                hitSlop={10}
                style={[
                  styles.circle,
                  isActive ? styles.circleActive : styles.circleInactive,
                ]}
                accessibilityRole='button'
                accessibilityLabel={`Step ${s}`}>
                <Text
                  style={[
                    styles.circleText,
                    isActive
                      ? styles.circleTextActive
                      : styles.circleTextInactive,
                  ]}>
                  {s}
                </Text>
              </Pressable> */}

              {idx < steps.length && (
                <View
                  style={[
                    styles.line,
                    idx < step ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* <Pressable
        onPress={onRightPress}
        hitSlop={10}
        style={styles.rightIconWrap}
        accessibilityRole='button'
        accessibilityLabel='Wizard options'>
        {rightIcon ?? <Text style={styles.rightIconFallback}>🎉</Text>}
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: '#111' },
  circleInactive: { backgroundColor: '#E6E6E6' },
  circleText: { fontSize: 12, fontWeight: '700' },
  circleTextActive: { color: '#FFF' },
  circleTextInactive: { color: '#666' },

  line: {
    height: 5,
    borderRadius: 2,
    flex: 1,
    marginHorizontal: 2,
  },
  lineActive: { backgroundColor: '#53721F' },
  lineInactive: { backgroundColor: '#E6E6E6' },

  rightIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIconFallback: { fontSize: 14 },
});
