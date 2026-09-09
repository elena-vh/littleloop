import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { color, font } from '@src/theme/theme';

type Props = {
  progress: number;
  size?: number;
  stroke?: number;
  trackColor?: string;
  fillColor?: string;
  children?: React.ReactNode;
};

export default function ProgressRing({
  progress,
  size = 74,
  stroke = 8,
  trackColor = 'rgba(32,30,29,0.14)',
  fillColor = color.acc2[700],
  children,
}: Props) {
  const p = Math.max(0, Math.min(1, progress));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const half = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={half}
          cy={half}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill='none'
        />
        <Circle
          cx={half}
          cy={half}
          r={r}
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap='round'
          fill='none'
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${half} ${half})`}
        />
      </Svg>
      {children != null && (
        <View style={styles.center} pointerEvents='none'>
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text style={styles.label}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: font.heading,
    fontSize: 15,
    color: color.acc2[900],
  },
});
